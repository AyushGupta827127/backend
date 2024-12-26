import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/send-email", async (req, res) => {
  const { to, subject, text, filename, fileurl } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Required fields: to, subject, text" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html: `
      <h1 style="color: #172554;">
        Welcome to Finance <span style="color: #f97316;">India</span>
      </h1>
      <br />
      <p style="font-weight: 400; font-size: 21px;">${text}</p>
    `,
  };

  if (filename && fileurl) {
    mailOptions.attachments = [{ filename, path: fileurl }];
  }

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.get("/welcome", (req, res) => res.send("Welcome to backend"));

export default app;
