import assert from 'assert';
import { afterEach } from 'mocha';
import { LoginDto } from '../src/interfaces/auth/request/LoginDto';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import User from '../src/models/User';
import AuthService from '../src/services/auth/AuthService';
import UserService from '../src/services/user/UserService';

describe('AuthService Tests', () => {
  // 단위 테스트 종료될때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
  });
  it('login test', async () => {
    // given
    const signupDto: SignupDto = {
      email: 'test@gmail.com',
      password: 'password',
      userName: '테스트유저',
      gender: '남자',
      fcmToken: '테스트토큰'
    };
    const createdUser = await UserService.createUser(signupDto);
    const createdUserId = createdUser._id.toString();
    const loginDto: LoginDto = {
      email: 'test@gmail.com',
      password: 'password',
      fcmToken: '테스트토큰'
    };

    // when
    const login = await AuthService.login(loginDto);

    // then
    assert.equal(login._id.toString(), createdUserId);
  });
});
