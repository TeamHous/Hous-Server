import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import mongoose from 'mongoose';
import errorGenerator from '../../errors/errorGenerator';
import { SignupDto } from '../../interfaces/auth/request/SignupDto';
import { PostBaseResponseDto } from '../../interfaces/common/response/PostBaseResponseDto';
import { UserTypeTestDto } from '../../interfaces/user/request/UserTypeTestDto';
import { UserUpdateDto } from '../../interfaces/user/request/UserUpdateDto';
import {
  UserNotificationUpdateDto,
  UserNotificationUpdateResponseDto
} from '../../interfaces/user/response/UserNotificationStateUpdateDto';
import { UserTypeTestResponseDto } from '../../interfaces/user/response/UserTypeTestResponseDto';
import { UserUpdateResponseDto } from '../../interfaces/user/response/UserUpdateResponseDto';
import Check from '../../models/Check';
import Event from '../../models/Event';
import Room from '../../models/Room';
import Rule from '../../models/Rule';
import RuleCategory from '../../models/RuleCategory';
import Type from '../../models/Type';
import User from '../../models/User';
import checkValidUtils from '../../modules/checkValidUtils';
import limitNum from '../../modules/limitNum';
import message from '../../modules/responseMessage';
import statusCode from '../../modules/statusCode';
import UserServiceUtils from './UserServiceUtils';

const createUser = async (
  signupDto: SignupDto
): Promise<PostBaseResponseDto> => {
  try {
    const existUser = await User.findOne({
      email: signupDto.email
    });
    if (existUser) {
      throw errorGenerator({
        msg: message.CONFLICT_EMAIL,
        statusCode: statusCode.CONFLICT
      });
    }

    const defaultTypeColor = await Type.findOne({ typeColor: 'GRAY' });
    if (!defaultTypeColor) {
      throw errorGenerator({
        msg: message.INVALID_TYPE_COLOR,
        statusCode: statusCode.INTERNAL_SERVER_ERROR
      });
    }

    const user = new User({
      email: signupDto.email,
      password: signupDto.password,
      userName: signupDto.userName,
      gender: signupDto.gender,
      birthday: dayjs(signupDto.birthday).format('YYYY-MM-DD'),
      fcmToken: signupDto.fcmToken,
      notificationState: true,
      typeId: defaultTypeColor._id
    });

    const salt: string = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(signupDto.password, salt);

    await user.save();

    const data = {
      _id: user._id
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (
  userId: string,
  userUpdateDto: UserUpdateDto
): Promise<UserUpdateResponseDto> => {
  try {
    await UserServiceUtils.findUserById(userId);

    if (Array.isArray(userUpdateDto.hashTag)) {
      checkValidUtils.checkArraySize(
        userUpdateDto.hashTag.length,
        limitNum.PROFILE_HASH_TAG_CNT
      );
      userUpdateDto.hashTag.forEach(tag => {
        checkValidUtils.checkStringLength(
          tag.length,
          limitNum.PROFILE_HASH_TAG_MAX_LENGTH
        );
      });
    }

    await User.findByIdAndUpdate(userId, userUpdateDto);
    const data: UserUpdateResponseDto = {
      userName: userUpdateDto.userName,
      job: userUpdateDto.job,
      introduction: userUpdateDto.introduction,
      hashTag: userUpdateDto.hashTag
    };
    return data;
  } catch (error) {
    throw error;
  }
};

const updateUserNotificationState = async (
  userId: string,
  userNotificationStateUpdateDto: UserNotificationUpdateDto
): Promise<UserNotificationUpdateResponseDto> => {
  try {
    const user = await UserServiceUtils.findUserById(userId);

    if (
      user.notificationState ===
      userNotificationStateUpdateDto.notificationState
    ) {
      throw errorGenerator({
        msg: message.BAD_REQUEST,
        statusCode: statusCode.BAD_REQUEST
      });
    }

    await user.updateOne(userNotificationStateUpdateDto);

    const data: UserNotificationUpdateResponseDto = {
      notificationState: userNotificationStateUpdateDto.notificationState
    };
    return data;
  } catch (error) {
    throw error;
  }
};

const updateUserTypeScore = async (
  userId: string,
  userTypeTestDto: UserTypeTestDto
): Promise<UserTypeTestResponseDto> => {
  try {
    const user = await UserServiceUtils.findUserById(userId);

    if (userTypeTestDto.typeScore.length !== 5) {
      throw errorGenerator({
        statusCode: statusCode.BAD_REQUEST,
        msg: message.BAD_REQUEST
      });
    }

    // 각 문제 타입당 3문제씩
    userTypeTestDto.typeScore.forEach(score => {
      if (score > 9 || score < 3) {
        throw errorGenerator({
          statusCode: statusCode.BAD_REQUEST,
          msg: message.BAD_REQUEST
        });
      }
    });

    await user.updateOne({ typeScore: userTypeTestDto.typeScore });

    const data: UserTypeTestResponseDto = {
      _id: user._id,
      typeScore: userTypeTestDto.typeScore
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId: string): Promise<void> => {
  try {
    // 유저 검증
    const user = await UserServiceUtils.findUserById(userId);

    // 방에 참가하지 않은 유저
    if (!user.roomId) {
      await user.deleteOne({ userId: userId });
    }
    // 방에 참가한 유저
    else {
      // 방이 존재하는지 검증
      const room = await Room.findById(user.roomId);
      if (!room) {
        throw errorGenerator({
          msg: message.NOT_FOUND_ROOM,
          statusCode: statusCode.NOT_FOUND
        });
      }

      // 이벤트에서 참여자에 존재할 경우 삭제
      const events = await Event.find({
        roomId: user.roomId
      });

      let deleteEventCnt: number = 0;
      for (const event of events) {
        // 참여자 배열에서 탈퇴할 userId를 제외한 배열 생성
        const participants: mongoose.Types.ObjectId[] =
          event.participantsId.filter(it => {
            !it.equals(userId);
          });

        // 나를 제외한 참여자가 존재할 경우, 업데이트
        if (participants.length > 0) {
          await Event.findOneAndUpdate(
            {
              _id: event._id
            },
            {
              participantsId: participants
            }
          );
        }
        // 나를 제외한 참여자가 존재하지 않을 경우, 이벤트 삭제
        else {
          event.deleteOne(event._id);
          deleteEventCnt++;
        }
      }

      // 규칙에서 고정 담당자가 존재할 경우, 담당 해제
      await Rule.updateMany(
        {
          roomId: room._id,
          'ruleMembers.userId': user._id
        },
        {
          $set: {
            'ruleMembers.$.userId': null
          }
        }
      );

      // 규칙에서 해당 유저가 임시 담당자로 있는 경우, 해당 부분만 삭제 후 업데이트
      const rules = await Rule.find({ roomId: user.roomId });
      for (const rule of rules) {
        // 임시 담당자에 존재할 경우, 본인 제외
        const tmpRuleMembersWithoutUser: mongoose.Types.ObjectId[] =
          rule.tmpRuleMembers.filter(it => {
            !it.equals(userId);
          });
        rule.updateOne({ tmpRuleMembers: tmpRuleMembersWithoutUser });
      }

      // 체크 컬렉션에서 해당 유저 삭제
      await Check.deleteMany({ userId: userId });

      const userInRoom = await User.find({ roomId: user.roomId });
      if (userInRoom.length === 1) {
        // 방에 사람이 없는 경우, 방을 삭제
        await Event.deleteMany({ roomId: room._id });
        await Rule.deleteMany({ roomId: room._id });
        await RuleCategory.deleteMany({ roomId: room._id });
        await room.deleteOne();
      } else {
        // 방에 사람 있음
        let roomOwner: mongoose.Types.ObjectId;
        // 방생성자가 유저라면 랜덤으로 owner 지정
        const otherUser = await User.findOne({
          $and: [{ roomId: room._id }, { _id: { $ne: userId } }]
        });

        if (room.roomOwner.toString() === userId && otherUser != null) {
          roomOwner = otherUser._id;
        } else {
          roomOwner = room.roomOwner;
        }
        // 방에 사람이 있는 경우, room 각 이벤트 개수 변경
        await room.updateOne({
          roomOwner: roomOwner,
          eventCnt: room.eventCnt - deleteEventCnt,
          userCnt: room.userCnt - 1
        });
      }

      // 유저 삭제
      await user.deleteOne({ userId: userId });
    }
  } catch (error) {
    throw error;
  }
};

export default {
  createUser,
  updateUser,
  updateUserNotificationState,
  updateUserTypeScore,
  deleteUser
};
