import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { RuleCategoryCreateDto } from '../interfaces/rulecategory/RuleCategoryCreateDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { RuleService } from '../services';

/**
 *  @route POST /room/:roomId/rules/category
 *  @desc Create RuleCategory
 *  @access Private
 */
const createRuleCategory = async (
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

  const ruleCategoryCreateDto: RuleCategoryCreateDto = req.body;
  const { roomId } = req.params;

  try {
    const data = await RuleService.createRuleCategory(
      roomId,
      ruleCategoryCreateDto
    );

    return res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.CREATE_RULE_CATEGORY, data)
      );
  } catch (error) {
    next(error);
  }
};

/**
 *  @route PUT /room/:roomId/rules/category/:categoryId
 *  @desc Update RuleCategory
 *  @access Private
 */
const updateRuleCategory = async (
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

  const ruleCategoryUpdateDto: RuleCategoryCreateDto = req.body;
  const { roomId, categoryId } = req.params;

  try {
    const data = await RuleService.updateRuleCategory(
      roomId,
      categoryId,
      ruleCategoryUpdateDto
    );

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_RULE_CATEGORY, data));
  } catch (error) {
    next(error);
  }
};

export default {
  createRuleCategory,
  updateRuleCategory
};
