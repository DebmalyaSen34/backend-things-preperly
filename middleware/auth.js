import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

export default async function Auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided!' });
        }

        const token = authHeader.split(" ")[1];

        // retrive the use details for the logged in user

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        next();
    } catch (error) {
        res.status(401).json({ error: "Authentication Failed!" });
    }
}

export function localVariables(req, res, next) {
    // access local variables using locals
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
}

export function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        return res.status(401).json({ error: 'Unauthorized access!' });
    }
}
