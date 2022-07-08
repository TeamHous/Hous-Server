import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { RoomCreateDto } from '../interfaces/room/RoomCreateDto';
import { RoomJoinDto } from '../interfaces/room/RoomJoinDto';
import { RoomResponseDto } from '../interfaces/room/RoomResponseDto';
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
  const roomCreateDto: RoomCreateDto = req.body;

  try {
    const result: PostBaseResponseDto = await RoomService.createRoom(
      userId,
      roomCreateDto
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
 *  @route GET /room/in
 *  @desc get Room
 *  @access Private
 */
const getRoomByRoomCode = async (
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
  const roomJoinDto: RoomJoinDto = req.body;

  try {
    const result: RoomResponseDto = await RoomService.getRoomByRoomCode(
      userId,
      roomJoinDto
    );

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_ROOM_SUCCESS, result));
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
  const roomJoinDto: RoomJoinDto = req.body;

  try {
    const result: PostBaseResponseDto = await RoomService.joinRoom(
      userId,
      roomId,
      roomJoinDto
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
  getRoomByRoomCode,
  joinRoom
};
