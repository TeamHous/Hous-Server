import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { TypeTestDto } from '../src/interfaces/type/request/TypeTestDto';
import { TypeTestResponseDto } from '../src/interfaces/type/response/TypeTestResponseDto';
import { UserUpdateDto } from '../src/interfaces/user/request/UserUpdateDto';
import { UserUpdateResponseDto } from '../src/interfaces/user/response/UserUpdateResponseDto';
import User from '../src/models/User';
import UserService from '../src/services/user/UserService';

describe('UserService Tests', () => {
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
  });
  it('createUser test', async () => {
    // given
    const signupDto: SignupDto = {
      email: 'test@gmail.com',
      password: 'password',
      userName: '테스트유저',
      gender: '남자',
      fcmToken: '테스트토큰'
    };

    // when
    const createdUser = await UserService.createUser(signupDto);
    const createdUserId = createdUser._id.toString();

    // then
    const user = await User.findById(createdUserId);
    assert.equal(user!.email, 'test@gmail.com');
    assert.equal(user!.userName, '테스트유저');
    assert.equal(user!.gender, '남자');
    assert.equal(user!.fcmToken, '테스트토큰');
  });

  it('updateUser test', async () => {
    // given
    const signupDto: SignupDto = {
      email: 'test@gmail.com',
      password: 'password',
      userName: '테스트유저',
      gender: '남자',
      fcmToken: '테스트토큰'
    };
    const userUpdateDto: UserUpdateDto = {
      userName: '김유저',
      job: '백수',
      introduction: '하잉 헬로 나는야 테스트 유저',
      hashTag: ['솝트최고', '서버최고']
    };
    const userId: string = (
      await UserService.createUser(signupDto)
    )._id.toString();

    // when
    const result: UserUpdateResponseDto = await UserService.updateUser(
      userId,
      userUpdateDto
    );

    // then
    const user = await User.findById(userId);
    assert.equal(user!.userName, result.userName);
    assert.equal(user!.job, result.job);
    assert.equal(user!.introduction, result.introduction);
    assert.equal(user!.hashTag.length, result.hashTag!.length);
    for (let i = 0; i < result.hashTag!.length; i++) {
      assert.equal(user!.hashTag[i], result.hashTag![i]);
    }
  });

  it('updateUserTypeScore', async () => {
    // given
    const signupDto: SignupDto = {
      email: 'test@gmail.com',
      password: 'password',
      userName: '테스트유저',
      gender: '남자',
      fcmToken: '테스트토큰'
    };
    const userTypeTestDto: TypeTestDto = {
      typeScore: [4, 5, 6, 7, 8]
    };
    const userId: string = (
      await UserService.createUser(signupDto)
    )._id.toString();

    //when
    const result: TypeTestResponseDto = await UserService.updateUserTypeScore(
      userId,
      userTypeTestDto
    );

    // then
    assert.equal(result._id.toString(), userId);
    assert.equal(result.typeId.toString(), '62d28672cc1d0ea0fc0c4b3d');
    assert.equal(result.typeScore.length, userTypeTestDto.typeScore.length);
    for (let i = 0; i < result.typeScore!.length; i++) {
      assert.equal(result!.typeScore[i], userTypeTestDto.typeScore![i]);
    }
  });
});
