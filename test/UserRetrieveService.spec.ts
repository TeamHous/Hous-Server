import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { UserProfileResponseDto } from '../src/interfaces/user/response/UserProfileResponseDto';
import User from '../src/models/User';
import UserRetrieveService from '../src/services/user/UserRetrieveService';
import UserService from '../src/services/user/UserService';

describe('UserRetrieveService Tests', () => {
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
  });
  it('getUserAtHome', async () => {
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
    const result: UserProfileResponseDto =
      await UserRetrieveService.getUserAtHome(userId);

    // then
    assert.equal(result.userName, signupDto.userName);
    assert.equal(result.job, '');
    assert.equal(result.introduction, '');
    assert.equal(result.hashTag.length, 0);
    assert.equal(result.typeId, '62d286a0cc1d0ea0fc0c4b4f');
    assert.equal(result.typeName, '임시 디폴트');
    assert.equal(result.typeColor, 'GRAY');
    assert.equal(result.typeScore!.length, 0);
    assert.equal(result.notificationState, true);
  });
});
