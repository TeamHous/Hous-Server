import mongoose from 'mongoose';
import { RuleInfo } from '../RuleInfo';

export interface RuleResponseDto extends RuleInfo {
  _id: mongoose.Types.ObjectId;
}
