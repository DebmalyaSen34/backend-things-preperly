import axios from 'axios';

const apiKey = 'creucccao9hdbteumm6g';
const apiSecret = '41e0jcvay18p3x96831mp20i';
const url = 'https://otp.api.engagelab.cc/v1/messages';
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