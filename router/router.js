import { Router } from "express";
const router = Router();

import * as controller from '../controllers/appControllers.js';

//* POST METHODS

router.route('/register').post(controller.register);

router.route('/authenticate').post((req, res) => res.end());

router.route('/login').post(controller.login);


//* GET METHODS

router.route('/user/:username').get(controller.getuser);

router.route('/user/generateOTP').get(controller.generateOTP);

router.route('/user/verifyOTP').get(controller.verifyOTP);

router.route('/user/createResetSession').get(controller.createResetSession);

//* PUT METHODS

router.route('/updateUser/:username').put(controller.updateUser);

router.route('/resetPassword/:username').put(controller.resetPassword);


export default router;