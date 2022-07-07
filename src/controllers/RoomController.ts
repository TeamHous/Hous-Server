import { NextFunction, Request, Response } from 'express';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { RoomService } from '../services';

/**
 *  @route POST /room
 *  @desc Create Room
 *  @access Private
 */
const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;

  try {
    const result: PostBaseResponseDto = await RoomService.createRoom(userId);

    return res
      .status(statusCode.CREATED)
      .send(
        util.success(
          statusCode.CREATED,
          message.CREATE_ROOM_SUCCESS,
          result._id
        )
      );
  } catch (error) {
    next(error);
  }
};

export default {
  createRoom
};
