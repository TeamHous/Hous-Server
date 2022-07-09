import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { EventCreateDto } from '../interfaces/event/EventCreateDto';
import { EventUpdateDto } from '../interfaces/event/EventUpdateDto';
import checkIconType from '../modules/checkIconType';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { EventService } from '../services';

/**
 *  @route POST /room/:roomId/event
 *  @desc Create Event
 *  @access private
 */
const createEvent = async (
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
  const eventCreateDto: EventCreateDto = req.body;
  const { roomId } = req.params;

  try {
    checkIconType.isEventIconType(eventCreateDto.eventIcon);

    const result = await EventService.createEvent(
      userId,
      roomId,
      eventCreateDto
    );

    return res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, result)
      );
  } catch (error) {
    next(error);
  }
};

/**
 *  @route PUT /room/:roomId/event/:eventId
 *  @desc Update Event
 *  @access private
 */
const updateEvent = async (
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
  const eventUpdateDto: EventUpdateDto = req.body;
  const { roomId, eventId } = req.params;

  try {
    checkIconType.isEventIconType(eventUpdateDto.eventIcon);

    const result = await EventService.updateEvent(
      userId,
      roomId,
      eventId,
      eventUpdateDto
    );

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_EVENT_SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

export default { createEvent, updateEvent };
