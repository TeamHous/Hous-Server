import errorGenerator from '../errors/errorGenerator';
import IconType from './IconType';
import message from './responseMessage';
import statusCode from './statusCode';

const isEventIconType = (iconType: string) => {
  if (IconType.IconTypeArray.indexOf(iconType) == -1) {
    throw errorGenerator({
      msg: message.INVALID_ICON,
      statusCode: statusCode.BAD_REQUEST
    });
  }
};

const isRuleCategoryIconType = (iconType: string) => {
  if (IconType.RuleCategoryIconTypeArray.indexOf(iconType) == -1) {
    throw errorGenerator({
      msg: message.INVALID_ICON,
      statusCode: statusCode.BAD_REQUEST
    });
  }
};

export default {
  isEventIconType,
  isRuleCategoryIconType
};
