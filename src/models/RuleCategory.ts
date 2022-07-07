import mongoose from 'mongoose';
import { RuleCategoryInfo } from '../interfaces/rulecategory/RuleCategoryInfo';

const RuleCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true
    },
    categoryIcon: {
      type: String,
      required: true
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
