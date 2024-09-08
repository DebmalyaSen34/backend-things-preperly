import { Router } from "express";
const router = Router();
import Auth, { isAuthenticated } from "../middleware/auth.js";
import { sendOtp } from "../controllers/smsOtpController.js";
import * as controller from "../controllers/appControllers.js";

//* POST METHODS

router.route("/register").post(controller.register);

router.route("/authenticate").post((req, res) => res.end());

router.route("/login").post(controller.verifyUser, controller.login);

router.route("/verifyOTP").post(controller.verifyOTP);

router.route("/logout").post(isAuthenticated, controller.logout);

//* GET METHODS

router.route("/protected").get(isAuthenticated, (req, res) => res.send('This is a protected route'));

router.route("/user/:username").get(controller.getuser);

router.route("/generateOTP").get(controller.verifyUser, controller.generateOTP);

router.route("/createResetSession").get(controller.createResetSession);

router.route("/sendOTP").get(controller.verifyUser, sendOtp);

//* PUT METHODS

router.route("/updateUser").put(Auth, controller.updateUser);

router.route("/resetPassword").put(controller.verifyUser, controller.resetPassword);

export default router;
