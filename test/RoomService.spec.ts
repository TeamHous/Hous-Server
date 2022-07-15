import assert from 'assert';
import { SignupDto } from '../src/interfaces/auth/SignupDto';
import { PostBaseResponseDto } from '../src/interfaces/common/PostBaseResponseDto';
import { RoomJoinDto } from '../src/interfaces/room/RoomJoinDto';
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
  it('joinRoom test', async () => {
    // given
    const signupDto1: SignupDto = {
      email: 'test1@gmail.com',
      password: 'password',
      userName: '테스트유저',
      gender: '남자',
      fcmToken: '테스트토큰'
    };
    const userId1: string = (
      await UserService.createUser(signupDto1)
    )._id.toString();
    const signupDto2: SignupDto = {
      email: 'test2@gmail.com',
      password: 'password',
      userName: '테스트유저',
      gender: '남자',
      fcmToken: '테스트토큰'
    };
    const userId2: string = (
      await UserService.createUser(signupDto2)
    )._id.toString();
    const createdRoom: RoomResponseDto = await RoomService.createRoom(userId1);
    const createdRoomId: string = createdRoom._id.toString();
    const createdRoomCode: string = createdRoom.roomCode;
    const roomJoinDto: RoomJoinDto = {
      roomCode: createdRoomCode
    };

    // when
    const result: PostBaseResponseDto = await RoomService.joinRoom(
      userId2,
      createdRoomId,
      roomJoinDto
    );

    // then
    const user = await User.findById(userId2);
    assert.equal(user!.roomId.toString(), createdRoomId);
    assert.equal(user!.roomId.toString(), result._id.toString());
    await Room.findByIdAndDelete(createdRoomId);
    await User.findByIdAndDelete(userId1);
    await User.findByIdAndDelete(userId2);
  });
});
