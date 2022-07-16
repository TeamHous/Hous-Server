import dayjs from 'dayjs';
import errorGenerator from '../../errors/errorGenerator';
import { PostBaseResponseDto } from '../../interfaces/common/response/PostBaseResponseDto';
import { RoomJoinDto } from '../../interfaces/room/request/RoomJoinDto';
import { RoomResponseDto } from '../../interfaces/room/response/RoomResponseDto';
import Check from '../../models/Check';
import Event from '../../models/Event';
import Room from '../../models/Room';
import Rule from '../../models/Rule';
import RuleCategory from '../../models/RuleCategory';
import User from '../../models/User';
import checkObjectIdValidation from '../../modules/checkObjectIdValidation';
import message from '../../modules/responseMessage';
import statusCode from '../../modules/statusCode';
import RoomServiceUtils from './RoomServiceUtils';

const createRoom = async (userId: string): Promise<RoomResponseDto> => {
  try {
    const user = await RoomServiceUtils.findUserById(userId);

    RoomServiceUtils.checkJoinedRoomId(user.roomId);

    const room = new Room({
      roomOwner: userId,
      roomCode: await RoomServiceUtils.createRoomCode()
    });

    await room.save();

    await User.findByIdAndUpdate(userId, {
      roomId: room._id
    });

    let ruleCategory = new RuleCategory({
      roomId: room._id,
      categoryName: '청소',
      categoryIcon: 'CLEAN'
    });

    ruleCategory = await ruleCategory.save();

    // 가이드용 이벤트 생성
    const event = new Event({
      roomId: room._id,
      eventName: '여기에 이벤트를 추가하세요.',
      eventIcon: 'PARTY',
      date: dayjs().add(10, 'day').format('YYYY-MM-DD'), // 오늘 + 10일
      participantsId: [user._id]
    });

    await event.save();

    // 가이드용 규칙 생성
    const keyRule = new Rule({
      roomId: room._id,
      categoryId: ruleCategory._id,
      ruleName: '설거지는 먹고 바로하기',
      ruleMembers: [],
      tmpRuleMembers: [],
      isKeyRules: true,
      notificationState: false,
      tmpUpdatedDate: dayjs().subtract(10, 'day').format('YYYY-MM-DD')
    });

    const rule = new Rule({
      roomId: room._id,
      categoryId: ruleCategory._id,
      ruleName: '화장실 청소',
      ruleMembers: [
        {
          userId: null,
          day: [0, 1, 2, 3, 4, 5, 6]
        }
      ],
      tmpRuleMembers: [],
      isKeyRules: false,
      notificationState: true,
      tmpUpdatedDate: dayjs().subtract(10, 'day').format('YYYY-MM-DD')
    });

    await keyRule.save();
    await rule.save();

    const data: RoomResponseDto = {
      _id: room._id,
      roomCode: room.roomCode
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const joinRoom = async (
  userId: string,
  roomId: string,
  roomJoinDto: RoomJoinDto
): Promise<PostBaseResponseDto> => {
  try {
    checkObjectIdValidation(roomId);

    const user = await RoomServiceUtils.findUserById(userId);

    RoomServiceUtils.checkJoinedRoomId(user.roomId);

    const room = await Room.findOne({
      _id: roomId,
      roomCode: roomJoinDto.roomCode
    });

    if (!room) {
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND
      });
    }

    await user.updateOne({ roomId: room._id });

    await room.updateOne({ userCnt: room.userCnt + 1 });

    const data: PostBaseResponseDto = {
      _id: room._id
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const leaveRoom = async (userId: string, roomId: string): Promise<void> => {
  try {
    checkObjectIdValidation(roomId);

    const user = await RoomServiceUtils.findUserById(userId);

    const room = await RoomServiceUtils.findRoomById(roomId);

    await RoomServiceUtils.checkForbiddenRoom(user.roomId, room._id);

    // user의 Check 삭제
    await Check.deleteMany({ userId: user._id });

    // user가 담당자인 Rule 담당 해제
    await Rule.updateMany(
      { roomId: room._id, 'ruleMembers.userId': user._id },
      {
        $set: {
          'ruleMembers.$.userId': null
        }
      }
    );

    // user가 포함된 Event user 제외, user가 없다면 Event 삭제
    await Event.updateMany(
      { roomId: room._id },
      {
        $pullAll: {
          participantsId: [user._id]
        }
      }
    );
    const deletedEvent = await Event.deleteMany({
      roomId: room._id,
      participantsId: { $size: 0 }
    });
    await room.updateOne({
      eventCnt: room.eventCnt - deletedEvent.deletedCount
    });

    await user.updateOne({ roomId: null });

    await room.updateOne({ userCnt: room.userCnt - 1 });

    // 퇴사한 유저가 방장이라면 방에 남은 유저에게 방장 위임
    const otherUser = await User.findOne({ roomId: room._id });

    if (room.roomOwner.equals(user._id)) {
      if (otherUser != null) {
        await room.updateOne({ roomOwner: otherUser._id });
      }
    }
    // Room에 남은 유저가 없다면 Room과 관련 데이터 전부 삭제
    if (otherUser == null) {
      await Event.deleteMany({ roomId: room._id });
      await Rule.deleteMany({ roomId: room._id });
      await RuleCategory.deleteMany({ roomId: room._id });
      await room.deleteOne();
    }
  } catch (error) {
    throw error;
  }
};

export default {
  createRoom,
  joinRoom,
  leaveRoom
};
