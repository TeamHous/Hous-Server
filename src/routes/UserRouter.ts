import { Router } from "express";
import { UserController } from "../controllers";
import { body } from "express-validator/check";

const router: Router = Router();

router.post(
    "/",
    [
        body("email").isEmail(), // email 형식
        body("password").isLength({ min: 6 }), // 최소 6자
    ],
    UserController.createUser
);
router.post(
    "/signin",
    [
        body("email").isEmail(), // email 형식
        body("password").isLength({ min: 6 }), // 최소 6자
    ],
    UserController.signInUser
);

export default router;
