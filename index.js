import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const PORT = 5000;

// Middleware to parse JSON request body
app.use(express.json());

// Email sending route
app.post("/send-email", async (req, res) => {
  const { to, subject, text, filename, fileurl } = req.body;

  // Validate input
  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Required fields: to, subject, text" });
  }

  // Configure the email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // Use SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Prepare email options
  const mailOptions = {
    from: process.env.SMTP_USER, // Sender email address
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

  // Add attachments if provided
  if (filename && fileurl) {
    mailOptions.attachments = [
      {
        filename: filename,
        path: fileurl,
      },
    ];
  }

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.get("/welcome",async (req, res) =>{
    return "Welcome to backend"
})
// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
