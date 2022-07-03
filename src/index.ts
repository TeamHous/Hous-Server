import express, { Request, Response, NextFunction } from "express";
import config from "./config";
const app = express();
import connectDB from "./loaders/db";
import routes from "./routes";
require("dotenv").config();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes); //라우터
// error handler

interface ErrorType {
    message: string;
    status: number;
}

// 모든 에러
app.use(function (
    err: ErrorType,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "production" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(config.port, () => {
    console.log(`
    ################################################
          🛡️  Server listening on port 🛡️
    ################################################
  `);
}).on("error", (err) => {
    console.error(err);
    process.exit(1);
});
