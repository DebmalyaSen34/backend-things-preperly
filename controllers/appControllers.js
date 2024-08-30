import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";

/* 
    "username": "johndoe",
    "paassword": "secret",
    "email": "johndoe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "mobileNumber": "+1 123-456-7890",
    "address": "123 Main St, Anytown, USA",
    "dob": "1990-01-01",
    "roles": ["user", "admin"]
*/
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        const existUsername = await userModel.findOne({ username });
        if (existUsername) {
            return res.status(400).send({ message: 'Username already exists' });
        }

        const existEmail = await userModel.findOne({ email });
        if (existEmail) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 36);

        const newUser = new userModel({ username, password: hashedPassword, profile, email });
        await newUser.save();

        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).send(error);
    }
}

/* 
    "username": "johndoe",
    "password": "secret"
*/

export async function login(req, res) {
    res.json({ message: 'User logged in successfully' });  // Simulating successful registration
}

export async function getuser(req, res) {
    res.json({ message: 'get User' });  // Simulating successful registration
}


/* 
    body: {
        firstName": "Deb",
        address": "221-B Baker St, Anytown, USA",
        roles": ["user"]
    }
*/

export async function updateUser(req, res) {
    res.json({ message: 'update User' });  // Simulating successful registration
}


export async function generateOTP(req, res) {
    res.json({ message: 'generate OTP' });  // Simulating successful registration
}


export async function verifyOTP(req, res) {
    res.json({ message: 'Verify OTP' });  // Simulating successful registration
}


export async function createResetSession(req, res) {
    res.json({ message: 'create reset session route' });  // Simulating successful registration
}


export async function resetPassword(req, res) {
    res.json({ message: 'reset password route' });  // Simulating successful registration
}