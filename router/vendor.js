import { Router } from "express";

const vendorRouter = Router();

import * as controller from '../controllers/vendorController.js';
import * as productController from '../controllers/productController.js';

//* POST METHODS

vendorRouter.post('/register', controller.createRestaurant);

vendorRouter.post('/login', controller.loginRestaurant);

vendorRouter.post("/addItems", controller.verifyRestaurant, productController.addItems);

//* GET METHODS

vendorRouter.get("/welcome", (req, res) => res.send({message: "Hi welcome to vendor server side!"}));

vendorRouter.get('/restaurant/:restaurantId', controller.getRestaurantById);

vendorRouter.get('/restaurant/getAll', controller.getAllRestaurants);

vendorRouter.get('/restaurant/generateOTP', controller.sendOTP);

vendorRouter.get('/restaurant/verifyOTP', controller.verifyOTP);

vendorRouter.get('/logout', controller.verifyRestaurant, controller.logoutRestaurant);

//* PUT METHODS

vendorRouter.put('/restaurant/:restaurantId', controller.updateRestaurant);

export default vendorRouter;