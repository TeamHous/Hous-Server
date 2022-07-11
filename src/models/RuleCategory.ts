import mongoose from 'mongoose';
import { RuleCategoryInfo } from '../interfaces/rulecategory/RuleCategoryInfo';

const RuleCategorySchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Room'
    },
    categoryName: {
      type: String,
      required: true
    },
    categoryIcon: {
      type: String,
      required: true
    },
    ruleCnt: {
      type: Number,
      required: false,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<RuleCategoryInfo & mongoose.Document>(
  'RuleCategory',
  RuleCategorySchema
);
