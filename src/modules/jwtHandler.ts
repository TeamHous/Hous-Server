import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../config";
import { JwtPayloadInfo } from "../interfaces/common/JwtPayloadInfo";

const getToken = (userId: mongoose.Schema.Types.ObjectId): string => {
    const payload: JwtPayloadInfo = {
        user: {
            id: userId,
        },
    };

    const accessToken: string = jwt.sign(payload, config.jwtSecret, {
        expiresIn: "2h",
    });

    return accessToken;
};

export default getToken;
