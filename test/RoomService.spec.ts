import assert from 'assert';
import { SignupDto } from '../src/interfaces/auth/SignupDto';
import { RoomResponseDto } from '../src/interfaces/room/RoomResponseDto';
import connectDB from '../src/loaders/db';
import Room from '../src/models/Room';
import User from '../src/models/User';
import RoomService from '../src/services/RoomService';
import UserService from '../src/services/UserService';

describe('RoomService Tests', () => {
  connectDB();
  it('createRoom test', async () => {
    // given
    const signupDto: SignupDto = {
      email: 'test@gmail.com',
      password: 'password',
      userName: '테스트유저',
      gender: '남자',
      fcmToken: '테스트토큰'
    };
    const userId: string = (
      await UserService.createUser(signupDto)
    )._id.toString();

    // when
    const result: RoomResponseDto = await RoomService.createRoom(userId);
    const createdRoomId: string = result._id.toString();

    // then
    const user = await User.findById(userId);
    assert.equal(user!.roomId.toString(), createdRoomId);
    await Room.findByIdAndDelete(createdRoomId);
    await User.findByIdAndDelete(userId);
  });
});
