import Restaurant from "../model/restaurant.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import order from "../model/order.model.js";

export async function verifyRestaurant(req, res, next){
    try {
        const {email} = req.method == "GET" ? req.query : req.body;

        let exist = await Restaurant.findOne({email: email});

        if(!exist) return res.status(404).send({message: "cannot find the restaurant while verifying!"});
        next();
    } catch (error) {
        return res.status(404).send({message: "Authentication error!"});
    }
}

export async function createRestaurant(req, res) {
    try {
        const {
            name,
            password,
            email,
            cuisine,
            pricing,
            address,
            rating
        } = req.body;

        if (!name || !password || !email || !cuisine || !pricing || !address || !rating) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const existRestaurant = await Restaurant.findOne({email: email});
        if(existRestaurant){
            res.status(409).send({message: "Restaurant already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        const newRestaurant = new Restaurant({
            restaurantName: name,
            password: newPassword,
            email: email,
            cuisineType: cuisine,
            priceRange: pricing,
            address: address,
            rating: rating
        });

        await newRestaurant.save();

        res.status(201).send({ message: "Restaurant registered successfully" });

    } catch (error) {
        //! console.error('Error creating restaurant:', error); 
        res.status(500).send({message: "Internal server error!"});
    }

}

export async function getRestaurantById(req, res) {
    res.send('GET /api/restaurant/:id'); //get restaurant by id
}

export async function updateRestaurant(req, res) {
    res.send('PUT /api/restaurant/:id'); //update restaurant by id
}

export async function deleteRestaurant(req, res) {
    res.send('DELETE /api/restaurant/:id'); //delete restaurant by id
}

export async function loginRestaurant(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).send({message: "Email and password are required!"});
        }
        const restaurant = await Restaurant.findOne({email: email});
        if(!restaurant){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send({message: "No such restaurant was found with that email!"});
        }
        const isMatch = await bcrypt.compare(password, restaurant.password);
        if(!isMatch){
            await session.abortTransaction();
            session.endSession();
            return res.status(401).send({message: "Invalid password!"});
        }
        
        req.session.restaurantId = restaurant._id;

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({ message: "Login successful" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log("Error loggin in restaurant", error);
        res.status(500).send({message: "Internal server error!"});
    }
}

export async function logoutRestaurant(req, res) {
    req.session.destroy(err=>{
        if(err){
            console.error('Error destroying session: ', err);
            return res.status(500).send({message: "Internal server error!"});
        }
        res.status(200).send({message: "Logout successfull!"});
    })
}

export async function sendOTP(req, res) {
    res.send('POST /api/restaurant/send-otp'); //send OTP to restaurant
}

export async function verifyOTP(req, res) {
    res.send('POST /api/restaurant/verify-otp'); //verify OTP from restaurant
}

export async function forgotPassword(req, res) {
    res.send('POST /api/restaurant/forgot-password'); //forgot password for restaurant
}

export async function resetPassword(req, res) {
    res.send('POST /api/restaurant/reset-password'); //reset password for restaurant
}

export async function getAllRestaurants(req, res) {
    res.send('GET /api/restaurant'); //get all restaurants
}

export async function searchRestaurants(req, res) {
    res.send('GET /api/restaurant/search'); //search restaurants by name or cuisine
}

// export async function addItems(req, res){
//     try{
//         const {
//             itemsWithPrices,

//         }
//     }
// }

export async function getOrders(req, res) {
    const restaurantId = req.session.restaurantId;
    console.log(restaurantId);

    if(!restaurantId){
        return res.status(404).send({message: "You are not logged in!"});
    }

    try{
        const orders = await order.find({restaurantId: restaurantId});
        res.status(200).send(orders);
    }catch(error){
        console.error(error);
        res.status(500).send({message: "Internal server error!"});
    }
}