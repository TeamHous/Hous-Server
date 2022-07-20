import errorGenerator from '../../errors/errorGenerator';
import Type from '../../models/Type';
import User from '../../models/User';
import message from '../../modules/responseMessage';
import statusCode from '../../modules/statusCode';

const findUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw errorGenerator({
      msg: message.UNAUTHORIZED,
      statusCode: statusCode.UNAUTHORIZED
    });
  }
  return user;
};

const findTypeById = async (typeId: string) => {
  const type = await Type.findById(typeId);
  if (!type) {
    throw errorGenerator({
      msg: message.NOT_FOUND_TYPE,
      statusCode: statusCode.NOT_FOUND
    });
  }
  return type;
};

const getTypeByTotalTypeScore = async (totalTypeScore: number) => {
  // 타입 점수에 따른 type._id return
  if (totalTypeScore >= 15 && totalTypeScore <= 20) {
    return await Type.findOne({ typeColor: 'YELLOW' }, { _id: 1 });
  } else if (totalTypeScore >= 21 && totalTypeScore <= 26) {
    return await Type.findOne({ typeColor: 'RED' }, { _id: 1 });
  } else if (totalTypeScore >= 27 && totalTypeScore <= 33) {
    return await Type.findOne({ typeColor: 'BLUE' }, { _id: 1 });
  } else if (totalTypeScore >= 34 && totalTypeScore <= 39) {
    return await Type.findOne({ typeColor: 'PURPLE' }, { _id: 1 });
  } else if (totalTypeScore >= 40 && totalTypeScore <= 45) {
    return await Type.findOne({ typeColor: 'GREEN' }, { _id: 1 });
  } else {
    return null;
  }
};

export default {
  findUserById,
  findTypeById,
  getTypeByTotalTypeScore
};
