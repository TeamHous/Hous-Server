import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { UserUpdateDto } from '../interfaces/user/UserUpdateDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { UserService } from '../services';

/**
 * @route POST /user/profile/me
 * @desc update user information
 * @access Public
 */
const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send(util.fail(400, message.BAD_REQUEST, errors.array()));
  }

  const userUpdateDto: UserUpdateDto = req.body;
  const userId: string = req.body.user._id;

  try {
    await UserService.updateUser(userId, userUpdateDto);

    return res.status(statusCode.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export default {
  updateUser
};
