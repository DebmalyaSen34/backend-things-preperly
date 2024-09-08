import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';

configDotenv();

const mailerSender = async (email, title, body) => {
    try {
        // create a transporter to send emails

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
            authMethod: 'LOGIN'
        });

        // send email to the user

        let info = await transporter.sendMail({
            from: "www.preperly.com - Abhinay",
            to: email,
            subject: title,
            html: body,
        });
        console.log("Email info", info);
        return info;
    } catch (error) {
        console.log(error);
    }
}

export default mailerSender;