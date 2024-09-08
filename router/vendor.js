import { Router } from "express";

const vendorRouter = Router();

import * as controller from '../controllers/vendorController.js';

//* POST METHODS

vendorRouter.post('/register', controller.createRestaurant);

vendorRouter.post('/login', controller.loginRestaurant);

//* GET METHODS

vendorRouter.get('/restaurant/:restaurantId', controller.getRestaurantById);

vendorRouter.get('/restaurant/getAll', controller.getAllRestaurants);

vendorRouter.get('/restaurant/generateOTP', controller.sendOTP);

vendorRouter.get('/restaurant/verifyOTP', controller.verifyOTP);

//* PUT METHODS

vendorRouter.put('/restaurant/:restaurantId', controller.updateRestaurant);

export default vendorRouter;