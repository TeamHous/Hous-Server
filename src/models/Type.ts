import mongoose from 'mongoose';
import { TypeInfo } from '../interfaces/type/TypeInfo';

const TypeSchema = new mongoose.Schema(
  {
    typeName: {
      type: String,
      required: true,
      unique: true
    },
    typeColor: {
      type: String,
      required: true,
      unique: true
    },
    typeImg: {
      type: String,
      required: true
    },
    typeOneComment: {
      type: String,
      required: true
    },
    typeDesc: {
      type: String,
      required: true
    },
    typeRulesTitle: {
      type: String,
      required: true
    },
    typeRules: [
      {
        type: String,
        required: true
      }
    ],
    good: {
      goodName: {
        type: String,
        required: true
      },
      goodImg: [
        {
          type: String,
          required: true
        }
      ]
    },
    bad: {
      badName: {
        type: String,
        required: true
      },
      badImg: [
        {
          type: String,
          required: true
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<TypeInfo & mongoose.Document>('Type', TypeSchema);
