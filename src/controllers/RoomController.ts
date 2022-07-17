import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { PostBaseResponseDto } from '../interfaces/common/response/PostBaseResponseDto';
import { RoomJoinDto } from '../interfaces/room/request/RoomJoinDto';
import { HomeResponseDto } from '../interfaces/room/response/HomeResponseDto';
import { RoomJoinResponseDto } from '../interfaces/room/response/RoomJoinResponseDto';
import { RoomResponseDto } from '../interfaces/room/response/RoomResponseDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { RoomRetrieveService, RoomService } from '../services';

/**
 *  @route GET /room
 *  @desc Read Room
 *  @access Private
 */
const getRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;

  try {
    const data: mongoose.Types.ObjectId | null =
      await RoomRetrieveService.getRoom(userId);

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_ROOM_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

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
 *  @route GET /room/in?roomcode=
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
  const { roomCode } = req.query;

  try {
    const data: RoomJoinResponseDto =
      await RoomRetrieveService.getRoomAndUserByRoomCode(
        userId,
        roomCode as string
      );

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
 *  @route DELETE /room/:roomId/out
 *  @desc leave Room
 *  @access Private
 */
const leaveRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId: string = req.body.user._id;
  const { roomId } = req.params;

  try {
    await RoomService.leaveRoom(userId, roomId);

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.LEAVE_ROOM_SUCCESS, null));
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
    const data: HomeResponseDto = await RoomRetrieveService.getRoomInfoAtHome(
      userId,
      roomId
    );

    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.READ_ROOM_AT_HOME_SUCCESS, data)
      );
  } catch (error) {
    next(error);
  }
};

export default {
  getRoom,
  createRoom,
  getRoomAndUserByRoomCode,
  joinRoom,
  leaveRoom,
  getRoomInfoAtHome
};
