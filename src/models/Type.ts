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
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<TypeInfo & mongoose.Document>('Type', TypeSchema);
