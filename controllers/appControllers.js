import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    let exist = await userModel.findOne({ username });
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
      mobileNumber,
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
      mobileNumber,
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

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    console.log("User successfully logged in");

    res.status(200).send({
      message: "User successfully found!",
      username: user.username,
      token,
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

/* 
    body: {
        firstName": "Deb",
        address": "221-B Baker St, Anytown, USA",
        roles": ["user"]
    }
*/

export async function updateUser(req, res) {
  try {
    const id = req.query.id;

    if (id) {
      const body = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid User ID format!" });
      }

      const user = userModel.findOne({ _id: id });
      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }

      const result = await userModel.updateOne({ _id: id }, body);

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
  res.json({ message: "generate OTP" }); // Simulating successful registration
}

export async function verifyOTP(req, res) {
  res.json({ message: "Verify OTP" }); // Simulating successful registration
}

export async function createResetSession(req, res) {
  res.json({ message: "create reset session route" }); // Simulating successful registration
}

export async function resetPassword(req, res) {
  res.json({ message: "reset password route" }); // Simulating successful registration
}
