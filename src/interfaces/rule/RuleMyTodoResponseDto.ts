import mongoose from 'mongoose';

export interface RuleMyTodoResponseDto {
  _id: mongoose.Types.ObjectId;
  categoryIcon: string;
  ruleName: string;
  isChecked: boolean;
}
