import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;
export const isValidObjectId = (id: string): boolean => {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};
