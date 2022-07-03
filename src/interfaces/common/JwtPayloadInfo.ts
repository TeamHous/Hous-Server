import mongoose from "mongoose";

export interface JwtPayloadInfo {
    user: {
        id: mongoose.Schema.Types.ObjectId;
    };
}
