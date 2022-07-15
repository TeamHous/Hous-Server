import mongoose from 'mongoose';
import { TypeInfo } from '../interfaces/type/TypeInfo';

const TypeSchema = new mongoose.Schema(
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
    answer: [
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

export default mongoose.model<TypeInfo & mongoose.Document>('Type', TypeSchema);
