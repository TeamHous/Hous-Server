import errorGenerator from '../errors/errorGenerator';
import User from '../models/User';

const findUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw errorGenerator({ statusCode: 401 });
  return user;
};

export default {
  findUserById
};
