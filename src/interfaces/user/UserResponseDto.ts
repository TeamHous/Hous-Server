import mongoose from "mongoose";
import { UserInfo } from "./UserInfo";

export interface UserResponseDto extends UserInfo {
    _id: mongoose.Schema.Types.ObjectId;
}
