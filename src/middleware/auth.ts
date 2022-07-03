import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import statusCode from "../modules/statusCode";
import message from "../modules/responseMessage";
import util from "../modules/util";

export default (req: Request, res: Response, next: NextFunction) => {
    // request-header 에서 토큰 받아오기
    const token = req.headers["authorization"]?.split(" ").reverse()[0];

    // 토큰 유뮤 검증
    if (!token) {
        return res
            .status(statusCode.UNAUTHORIZED)
            .send(util.fail(statusCode.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
    }

    // 토큰 검증
    try {
        const decoded = jwt.verify(token, config.jwtSecret);

        req.body.user = (decoded as any).user;

        next();
    } catch (error: any) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res
                .status(statusCode.UNAUTHORIZED)
                .send(
                    util.fail(statusCode.UNAUTHORIZED, message.INVALID_TOKEN)
                );
        }
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(
            util.fail(
                statusCode.INTERNAL_SERVER_ERROR,
                message.INTERNAL_SERVER_ERROR
            )
        );
    }
};
