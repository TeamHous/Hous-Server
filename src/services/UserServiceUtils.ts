import errorGenerator from '../errors/errorGenerator';
import User from '../models/User';
import statusCode from '../modules/statusCode';

const findUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw errorGenerator({ statusCode: statusCode.UNAUTHORIZED });
  return user;
};

export default {
  findUserById
};
