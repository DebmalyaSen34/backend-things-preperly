import { Router } from "express";
const router = Router();
import Auth, { localVariables } from "../middleware/auth.js";
import * as controller from "../controllers/appControllers.js";

//* POST METHODS

router.route("/register").post(controller.register);

router.route("/authenticate").post((req, res) => res.end());

router.route("/login").post(controller.verifyUser, controller.login);

//* GET METHODS

router.route("/user/:username").get(controller.getuser);

router.route("/generateOTP").get(controller.verifyUser, localVariables, controller.generateOTP);

router.route("/verifyOTP").get(controller.verifyOTP);

router.route("/createResetSession").get(controller.createResetSession);

//* PUT METHODS

router.route("/updateUser").put(Auth, controller.updateUser);

router.route("/resetPassword/:username").put(controller.resetPassword);

export default router;
