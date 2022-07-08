import mongoose from 'mongoose';
import errorGenerator from '../errors/errorGenerator';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';

const checkObjectIdValidation = (id: string): void => {
  const ObjectId = mongoose.Types.ObjectId;
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return;
    throw errorGenerator({
      msg: message.INVALID_ID,
      statusCode: statusCode.BAD_REQUEST
    });
  }
  throw errorGenerator({
    msg: message.INVALID_ID,
    statusCode: statusCode.BAD_REQUEST
  });
};

export default checkObjectIdValidation;
