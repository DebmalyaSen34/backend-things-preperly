import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import router from "./router/router.js";
import connectToDatabase from "./database/config.js";
const app = express();

const PORT = process.env.PORT || 3000;

connectToDatabase().then(() => {
    try{
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(error){
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
});

app.use(express.json());

app.get('/', (req, res) => {
    res.status(201).json("Welcome to the API!");
});

//* API routes

app.use('/api', router);