import { TypeTestInfoResponseDto } from '../../interfaces/type/response/TypeTestInfoResponseDto';
import { TypeTestInfo } from '../../interfaces/type/TypeTestInfo';
import TypeTest from '../../models/TypeTest';
import checkObjectIdValidation from '../../modules/checkObjectIdValidation';
import TypeServiceUtils from './TypeServiceUtils';

const getTypeTestInfo = async (
  userId: string
): Promise<TypeTestInfoResponseDto> => {
  try {
    // ObjectId 인지 확인
    checkObjectIdValidation(userId);
    // 유저 존재 확인
    await TypeServiceUtils.findUserById(userId);

    const typeTests: TypeTestInfo[] = await TypeTest.find();

    typeTests.sort((before, current) => {
      return before.testNum - current.testNum ? 1 : -1;
    });

    const data: TypeTestInfoResponseDto = {
      typeTests: typeTests
    };
    return data;
  } catch (error) {
    throw error;
  }
};

export default { getTypeTestInfo };
