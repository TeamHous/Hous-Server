import errorGenerator from '../errors/errorGenerator';
import IconTypeArray from './IconType';
import message from './responseMessage';
import statusCode from './statusCode';

const isIconType = (iconType: string) => {
  if (IconTypeArray.indexOf(iconType) == -1) {
    throw errorGenerator({
      msg: message.INVALID_ICON_ENUM,
      statusCode: statusCode.BAD_REQUEST
    });
  }
};

export default isIconType;
