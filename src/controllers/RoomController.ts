import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { CreateRoomDto } from '../interfaces/room/CreateRoomDto';
import { JoinRoomDto } from '../interfaces/room/JoinRoomDto';
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
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST, errors.array())
      );
  }

  const userId: string = req.body.user._id;
  const createRoomDto: CreateRoomDto = req.body;

  try {
    const result: PostBaseResponseDto = await RoomService.createRoom(
      userId,
      createRoomDto
    );

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

/**
 *  @route POST /room/:roomId/in
 *  @desc join Room
 *  @access Private
 */
const joinRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST, errors.array())
      );
  }

  const userId: string = req.body.user._id;
  const { roomId } = req.params;
  const joinRoomDto: JoinRoomDto = req.body;

  try {
    const result: PostBaseResponseDto = await RoomService.joinRoom(
      userId,
      roomId,
      joinRoomDto
    );

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.JOIN_ROOM_SUCCESS, result._id));
  } catch (error) {
    next(error);
  }
};

export default {
  createRoom,
  joinRoom
};
