import mongoose from "mongoose";
import mailerSender from "../utils/mailer.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import userModel from "./user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5
    }
});

// Define a function to send otp to the given email

async function sendOtpVerification(email, otp) {
    try {

        const templatePath = path.join(__dirname, '../templates/otpTemplate.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        htmlContent = htmlContent.replace("{{OTP}}", otp);

        const user = await userModel.findOne({ email: email });

        htmlContent = htmlContent.replace("{{firstName}}", user.firstName);

        const mailResponse = await mailerSender(
            email,
            "Verification Email",
            htmlContent
        );

        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurec while sending OTP: ", error);
        throw error;
    }
}

otpSchema.pre("save", async function (next) {
    console.log("new document saved to database");
    //! Only send OTP when new document is created
    if (this.isNew) {
        await sendOtpVerification(this.email, this.otp);
    }
    next();
});

const OtpModel = mongoose.model("Otp", otpSchema);

export { OtpModel, sendOtpVerification };