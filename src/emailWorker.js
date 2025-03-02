const { Worker } = require("bullmq");
const Redis = require("ioredis");
const nodemailer = require("nodemailer");
require("dotenv").config();


const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, 
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    try {
      const { email, name } = job.data;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to Our Practice Management System!",
        text: `Hello ${name},\n\nWelcome to our system! Your practice is now set up.\n\nBest regards,\nTeam`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${email}`);
    } catch (error) {
      console.error("❌ Email sending failed:", error);
    }
  },
  {
    connection,
  }
);

console.log("📨 Email worker is running...");
