import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        unique: false
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"]
    },

    firstName: {type: String},
    lastName: {type: String},
    mobile: {type: Number},
    address: {type: String},
    roles: {type: String},
});

export default  mongoose.model.Users || mongoose.model('User', userSchema);