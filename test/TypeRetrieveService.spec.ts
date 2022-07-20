import assert from 'assert';
import { SignupDto } from '../src/interfaces/auth/request/SignupDto';
import { TypeTestInfoResponseDto } from '../src/interfaces/type/response/TypeTestInfoResponseDto';
import UserService from '../src/services/user/UserService';
import TypeRetrieveService from '../src/services/type/TypeRetrieveService';
import { TypeTestInfo } from '../src/interfaces/type/TypeTestInfo';
import User from '../src/models/User';

describe('TypeRetrieveService Tests', () => {
  // 단위 테스트 종료될 때마다 서비스 관련 컬렉션 초기화
  afterEach(async () => {
    await User.collection.drop();
  });
  it('getTypeTestInfo test', async () => {
    //given
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

    // when
    const response: TypeTestInfoResponseDto =
      await TypeRetrieveService.getTypeTestInfo(userId1);

    // then
    assert.equal(response.typeTests.length, 15);
    response.typeTests.forEach((typeTest: TypeTestInfo, index: number) => {
      assert.equal(typeTest.testNum, index + 1);
    });
  });
});
