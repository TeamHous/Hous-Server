import assert from 'assert';
import { afterEach } from 'mocha';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
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
});
