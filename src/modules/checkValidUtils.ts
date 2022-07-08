import errorGenerator from '../errors/errorGenerator';
import message from './responseMessage';
import statusCode from './statusCode';

const checkCountLimit = (currentSize: number, limitSize: number): void => {
  if (currentSize > limitSize) {
    throw errorGenerator({
      msg: message.EXCEED_CNT,
      statusCode: statusCode.BAD_REQUEST
    });
  }
};

const checkStringLength = (fieldLength: number, limitLength: number): void => {
  if (fieldLength > limitLength) {
    throw errorGenerator({
      msg: message.EXCEED_LENGTH,
      statusCode: statusCode.BAD_REQUEST
    });
  }
};

export default {
  checkCountLimit,
  checkStringLength
};
