//* NPM packages
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";

//* Defined files
import router from "./router/router.js";
import vendorRouter from "./router/vendor.js"; // vendor routes
import connectToDatabase from "./database/config.js"; // client routes
import { Auth } from "./middleware/auth.js";

//* Middlewares
const app = express();
app.use(cookieParser());

//* PORT configuration
const PORT = process.env.PORT || 3000;

//* ENV configuration
configDotenv();

//* Connnect to the Database
connectToDatabase().then(() => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
});

//* Configure session middleware
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60, // 14 days
        autoRemove: 'native'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14, //todo: make this for 1 month
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
}));

//* Middleware for parsing JSON request bodies
app.use(express.json());

//* Middleware for Authenticating cookies
app.use(Auth);


//* Main route
app.get('/', (req, res) => {
    res.status(201).json("Welcome to the API!");
});

//* ---------------------- API routes ------------------------- *//

// for client usage
app.use('/api', router);

// for vendor usage
app.use('/vendor', vendorRouter);