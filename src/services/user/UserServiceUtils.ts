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

export default {
  findUserById,
  findTypeById
};
