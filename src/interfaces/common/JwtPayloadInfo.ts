import mongoose from 'mongoose';

export interface JwtPayloadInfo {
  user: {
    _id: mongoose.Schema.Types.ObjectId;
  };
}
