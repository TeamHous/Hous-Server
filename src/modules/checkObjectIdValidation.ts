import mongoose from 'mongoose';
import errorGenerator from '../errors/errorGenerator';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';

const ObjectId = mongoose.Types.ObjectId;
export const checkObjectIdValidation = (id: string): void => {
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
