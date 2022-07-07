import mongoose from 'mongoose';
import { RuleInfo } from '../interfaces/rule/RuleInfo';

const RuleSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Room'
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'RuleCategory'
    },
    ruleName: {
      type: String,
      required: true
    },
    ruleMembers: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          required: false,
          ref: 'User'
        },
        day: [
          {
            type: Number,
            required: false
          }
        ]
      }
    ],
    tmpRuleMembers: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          required: false,
          ref: 'User'
        },
        day: [
          {
            type: Number,
            required: false
          }
        ]
      }
    ],
    isKeyRules: {
      type: Boolean,
      required: true
    },
    notificationState: {
      type: Boolean,
      required: true
    },
    tmpUpdatedDate: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<RuleInfo & mongoose.Document>('Rule', RuleSchema);
