import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import otpGenerator from 'otp-generator';
import { OtpModel } from "../model/otpModel.model.js";

export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    let exist = await userModel.findOne({ username: username });
    if (!exist) return res.status(404).send({ message: "cannot find user" });
    next();
  } catch (error) {
    return res.status(404).send({ message: "Authentication Error" });
  }
}
export async function register(req, res) {
  try {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      mobile,
      address,
      roles,
    } = req.body;

    const existUsername = await userModel.findOne({ username });
    if (existUsername) {
      return res.status(400).send({ message: "Username already exists" });
    }

    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      mobile,
      address,
      roles,
    });
    await newUser.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    console.log("Login request recieved: ", req.body);
    const user = await userModel.findOne({ username });
    if (!user) {
      console.log("User not found with that username");
      return res
        .status(400)
        .send({ message: "User not found with that username!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Wrong password");
      return res.status(400).send({ message: "Wrong password!" });
    }

    configDotenv();

    const token = jwt.sign({userId: user._id, username: user.username}, process.env.JWT_SECRET, { expiresIn: '30d'});

    console.log("token: ", token);

    res.cookie('authToken', token);

    // req.session.userId = user._id;
    // req.session.username = user.username;

    res.status(200).send({
      message: "User successfully logged in!",
      username: user.username
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send(error);
  }
}

export async function getuser(req, res) {
  const { username } = req.params;

  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(501).send({ error: "Couldn't find user" });
    }

    //* Object.assign({}, user.toJSON()) ----> converts the data sent by mongodb
    //*                                        after filtering to JSON format

    const { password, ...rest } = Object.assign({}, user.toJSON());

    return res.status(201).send(rest);
  } catch (error) {
    return res.status(404).send({ error: "Couldn't Find user data!" });
  }
}

export async function updateUser(req, res) {
  try {
    // const id = req.query.id;

    const { userId } = req.user;

    if (userId) {
      const body = req.body;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid User ID format!" });
      }

      const user = userModel.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }

      const result = await userModel.updateOne({ _id: userId }, body);

      if (result.nModified === 0) {
        return res
          .status(404)
          .send({ message: "User not found or no changes made!" });
      }

      return res.status(200).send({ message: "Record updated successfully!" });
    } else {
      return res.status(401).send({ error: "User not found!" });
    }
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
}



export async function generateOTP(req, res) {
  try {
    const { email } = req.body;

    const existingOtp = await OtpModel.findOne({ email: email });

    if(existingOtp){
      const currentTime = new Date();
      const otpCreationTime = new Date(existingOtp.createdAt);
      const diffTime = Math.abs(currentTime - otpCreationTime) / 1000;

      if(diffTime < 5*60){
        return res.status(400).send({ message: 'OTP generation request f 5 minutes is not allowed!', time: diffTime});
      }
    }

    const OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    const otpUser = await OtpModel.findOne({ email: email });
    if (otpUser) {
      await OtpModel.findOneAndUpdate({ email: email }, { otp: OTP }, { upsert: true, new: true });
    } else {
      await OtpModel.create({ email: email, otp: OTP }); //* email is being sent to the user from the model here
    }
    res.status(201).send({ code: OTP });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OtpModel.findOne({ email: email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(404).send({ message: 'OTP not found!' });
    }

    req.session.user = { email: email };

    res.status(200).send({ message: 'OTP verified successfully!', success: true });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function logout(req, res) {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error destroying session:', error);
      return res.status(500).send({ message: "Error loggin you out!" });
    }
    res.clearCookie('connect.sid');
    res.clearCookie('authToken');
    res.status(200).send({ message: 'User logged out successfully!' });
  });
}

export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; // allow this route only once
    return res.status(201).send({ msg: 'Reset Session Created!' });
  }
  return res.status(400).send({ error: 'Session expired!' });
}

export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: 'Invalid or expired reset session!' });  // Check if resetSession is not null or expired. If not, return error.  // ResetSession is created when OTP is verified and session is allowed.  // req.app.locals is a global object that persists across requests.  // req.app.locals.resetSession is set to true in the verifyOTP route.  // req.app.locals.resetSession is reset to false in the resetPassword route.  // This is done to ensure that the password reset route is called only once.  // This is done to prevent resetting the password multiple times if the user tries to reset it again while the previous reset session is still valid.  // If the resetSession is not valid, the user will receive an error message saying 'Invalid or expired reset session!'.  // If the resetSession is valid, the user will be able to
    }
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: 'User not found!' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.updateOne({ username }, { password: hashedPassword });
      return res.status(201).send({ msg: 'Password Reset Successfully!' });
    }
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
}










//* This is a testing function to make sure cookies are working fine

export async function testFunction(req, res){
  const token = req.cookies.authToken;
  if(!token){
    return res.status(401).send({ message: "No token found!" });
  }else{
    return res.status(200).send({ message: "Token found!" });
  }
}