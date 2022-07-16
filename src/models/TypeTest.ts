import mongoose from 'mongoose';
import { TypeTestInfo } from '../interfaces/type/TypeTestInfo';

const TypeTestSchema = new mongoose.Schema(
  {
    testNum: {
      type: Number,
      required: true,
      unique: true
    },
    question: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      required: true
    },
    answers: [
      {
        type: String,
        required: true
      }
    ],
    questionImg: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<TypeTestInfo & mongoose.Document>(
  'TypeTest',
  TypeTestSchema
);
