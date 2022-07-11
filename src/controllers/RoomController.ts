import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { HomeResponseDto } from '../interfaces/room/HomeResponseDto';
import { RoomJoinDto } from '../interfaces/room/RoomJoinDto';
import { RoomJoinResponseDto } from '../interfaces/room/RoomJoinResponseDto';
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
  const userId: string = req.body.user._id;

  try {
    const data: RoomResponseDto = await RoomService.createRoom(userId);

    return res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.CREATE_ROOM_SUCCESS, data)
      );
  } catch (error) {
    next(error);
  }
};

/**
 *  @route GET /room/in
 *  @desc get Room and User
 *  @access Private
 */
const getRoomAndUserByRoomCode = async (
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
    const data: RoomJoinResponseDto =
      await RoomService.getRoomAndUserByRoomCode(userId, roomJoinDto);

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_ROOM_SUCCESS, data));
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
    const data: PostBaseResponseDto = await RoomService.joinRoom(
      userId,
      roomId,
      roomJoinDto
    );

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.JOIN_ROOM_SUCCESS, data._id));
  } catch (error) {
    next(error);
  }
};

/**
 *  @route Get /room/:roomId/home
 *  @desc Read room info at home view
 *  @access Private
 */
const getRoomInfoAtHome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;
  const { roomId } = req.params;

  try {
    const data: HomeResponseDto = await RoomService.getRoomInfoAtHome(
      userId,
      roomId
    );

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_ROOM_AT_HOME, data));
  } catch (error) {
    next(error);
  }
};

export default {
  createRoom,
  getRoomAndUserByRoomCode,
  joinRoom,
  getRoomInfoAtHome
};
