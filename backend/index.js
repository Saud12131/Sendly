import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import nodemailer from "nodemailer";
import connectToMongoDB, { agenda, connectWithMongoose } from './src/db/db.js';
import cors from "cors"
import { signin, signup } from "./src/contoller/userContro.js"
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
     origin: ['https://sendly-six.vercel.app', 'http://localhost:5173'],
    credentials: true,
  })
);

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

agenda.define('sendEmailOnce', async (job) => {
  const { to, subject, text } = job.attrs.data;

  try {
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER}`,
      to: to,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
});

app.get("/", (req, res) => {
  res.send("working");
});
app.post("/signup", signup);
app.post("/signin", signin);
// API endpoint to schedule 
app.post("/schedule-email-once", async (req, res) => {
  const { emails,
    scheduleTime,
    templateData } = req.body;

  const to = emails;
  const subject = templateData.subject
  const text = templateData.description
  const time = scheduleTime
  if (!to || !subject || !text || !time) { // Added validation for 'time'
    return res.status(400).send("Please provide 'to', 'subject', 'text', and 'time' in the request body.");
  }

  try {
    const scheduleTime = new Date(time);

    const job = await agenda.schedule(scheduleTime, 'sendEmailOnce', { to, subject, text });

    res.json({ message: `Email scheduled sucessfully to be sent once at ${scheduleTime.toLocaleString()}` }).status(201)

  } catch (error) {
    console.error('Error scheduling email:', error);
    res.status(500).send('Failed to schedule email.');
  }
});
connectWithMongoose();
connectToMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to database connection error:", err);
  });

// Graceful shutdown
async function gracefulShutdown() {
  console.log('Shutting down...');
  await agenda.stop();
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
