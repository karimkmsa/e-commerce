import express from "express";
import * as authController from "./auth.controller.js";
const authRouter = express.Router();

authRouter.post("/signup", authController.signUp);
authRouter.post("/signIn", authController.signIn);
authRouter.post("/signOut", authController.signOut);

export default authRouter;



