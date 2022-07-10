import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { RuleCreateDto } from '../interfaces/rule/RuleCreateDto';
import { RuleResponseDto } from '../interfaces/rule/RuleResponseDto';
import { RuleCategoryCreateDto } from '../interfaces/rulecategory/RuleCategoryCreateDto';
import { RuleCategoryUpdateDto } from '../interfaces/rulecategory/RuleCategoryUpdateDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { RuleService } from '../services';

/**
 *  @route POST /room/:roomId/rule
 *  @desc Create Rule
 *  @access Private
 */
const createRule = async (
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
  const ruleCreateDto: RuleCreateDto = req.body;
  const { roomId } = req.params;

  try {
    const data: RuleResponseDto = await RuleService.createRule(
      userId,
      roomId,
      ruleCreateDto
    );

    return res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.CREATE_RULE_SUCCESS, data)
      );
  } catch (error) {
    next(error);
  }
};

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

  const userId: string = req.body.user._id;
  const ruleCategoryCreateDto: RuleCategoryCreateDto = req.body;
  const { roomId } = req.params;

  try {
    const data = await RuleService.createRuleCategory(
      userId,
      roomId,
      ruleCategoryCreateDto
    );

    return res
      .status(statusCode.CREATED)
      .send(
        util.success(
          statusCode.CREATED,
          message.CREATE_RULE_CATEGORY_SUCCESS,
          data
        )
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

  const userId: string = req.body.user._id;
  const ruleCategoryUpdateDto: RuleCategoryUpdateDto = req.body;
  const { roomId, categoryId } = req.params;

  try {
    const data = await RuleService.updateRuleCategory(
      userId,
      roomId,
      categoryId,
      ruleCategoryUpdateDto
    );

    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.UPDATE_RULE_CATEGORY_SUCCESS, data)
      );
  } catch (error) {
    next(error);
  }
};

export default {
  createRule,
  createRuleCategory,
  updateRuleCategory
};
