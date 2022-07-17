import { NextFunction, Request, Response } from 'express';
import { TypeTestInfoResponseDto } from '../interfaces/type/response/TypeTestInfoResponseDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import TypeRetrieveService from '../services/type/TypeRetrieveService';

/**
 * @route GET /type/test
 * @desc Get user type test
 * @access Private
 */
const getTypeTestInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;
  try {
    const data: TypeTestInfoResponseDto =
      await TypeRetrieveService.getTypeTestInfo(userId);

    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.GET_USER_TEST_TYPE_SUCCESS, data)
      );
  } catch (error) {
    next(error);
  }
};

export default { getTypeTestInfo };
