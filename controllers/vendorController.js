import Restaurant from "../model/restaurant.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import otpGenerator from 'otp-generator';

export async function createRestaurant(req, res){
    res.send('POST /api/restaurant'); //create restaurant
}

export async function getRestaurantById(req, res){
    res.send('GET /api/restaurant/:id'); //get restaurant by id
}

export async function updateRestaurant(req, res){
    res.send('PUT /api/restaurant/:id'); //update restaurant by id
}

export async function deleteRestaurant(req, res){
    res.send('DELETE /api/restaurant/:id'); //delete restaurant by id
}

export async function loginRestaurant(req, res){
    res.send('POST /api/restaurant/login'); //login restaurant
}

export async function sendOTP(req, res){
    res.send('POST /api/restaurant/send-otp'); //send OTP to restaurant
}

export async function verifyOTP(req, res){
    res.send('POST /api/restaurant/verify-otp'); //verify OTP from restaurant
}

export async function forgotPassword(req, res){
    res.send('POST /api/restaurant/forgot-password'); //forgot password for restaurant
}

export async function resetPassword(req, res){
    res.send('POST /api/restaurant/reset-password'); //reset password for restaurant
}

export async function getAllRestaurants(req, res){
    res.send('GET /api/restaurant'); //get all restaurants
}

export async function searchRestaurants(req, res){
    res.send('GET /api/restaurant/search'); //search restaurants by name or cuisine
}