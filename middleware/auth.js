import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

export function Auth(req, res, next) {
    const token = req.cookies.authToken;
    console.log(token)
    if(!token){
        console.log("No auth token"); //! Being logged in 2 times
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).send({message: "Invalid token"});
        }

        req.session.userId = user.userId;
        req.session.username = user.username;
        console.log(req.session.userId, req.session.username);
        next();
    });
}

export function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        return res.status(401).json({ error: 'Unauthorized access!' });
    }
}


