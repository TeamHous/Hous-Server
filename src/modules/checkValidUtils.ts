import errorGenerator from '../errors/errorGenerator';
import message from './responseMessage';
import statusCode from './statusCode';

const checkCountLimit = (currentSize: number, limitSize: number): void => {
  if (currentSize >= limitSize) {
    throw errorGenerator({
      msg: message.EXCEED_CNT,
      statusCode: statusCode.BAD_REQUEST
    });
  }
};

const checkArraySize = (currentSize: number, limitSize: number): void => {
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

const checkDayNumber = (day: number): void => {
  const validDays: number[] = [0, 1, 2, 3, 4, 5, 6];
  if (validDays.indexOf(day) == -1) {
    throw errorGenerator({
      msg: message.INVALID_DAY,
      statusCode: statusCode.BAD_REQUEST
    });
  }
};

export default {
  checkCountLimit,
  checkArraySize,
  checkStringLength,
  checkDayNumber
};
