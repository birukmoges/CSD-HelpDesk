const nodemailer = require("nodemailer");

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: "Gmail", // Use Gmail or other services
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your app password
    },
    tls: {
        rejectUnauthorized: false, // Skip certificate validation
    },
});

console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        };

        console.log("Attempting to send email...");
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
        return info.response;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Email could not be sent");
    }
};

module.exports = sendEmail;
