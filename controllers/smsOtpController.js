import axios from 'axios';
import { configDotenv } from 'dotenv';

configDotenv();

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const url = process.env.API_URL;
const headers = { 'Content-Type': 'application/json' };

export async function sendOtp(req, res) {
    const { to, templateId, language } = req.body;

    const data = {
        to: to,
        template: {
            id: templateId,
            language: language || 'en'
        }
    };

    const auth = {
        username: apiKey,
        password: apiSecret
    };

    try {
        const response = await axios.post(url, data, { headers: headers, auth: auth });
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.response ? error.response.data : error.message });
    }
}