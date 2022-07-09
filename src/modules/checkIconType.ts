import errorGenerator from '../errors/errorGenerator';
import IconType from './IconType';
import message from './responseMessage';
import statusCode from './statusCode';

const isEventIconType = (eventIcon: string) => {
  if (IconType.EventIconTypeArray.indexOf(eventIcon) == -1) {
    throw errorGenerator({
      msg: message.INVALID_ICON,
      statusCode: statusCode.BAD_REQUEST
    });
  }
};

export default { isEventIconType };
