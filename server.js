const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Configure Nodemailer with your email provider (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'xxxx xxxx xxxx xxxx' // Your Google App Password
  }
});

// 2. Handle the Form Submission Endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, college, department, year } = req.body;

  const mailOptions = {
    from: '"SympoFlow Teams" <your-email@gmail.com>',
    to: email, // Pushes to the registrant's entered email id smoothly
    subject: '🎉 Registration Confirmed: Symposium 2026',
    text: `Hi ${name},\n\nYour registration details have been received successfully.\n\nInstitution: ${college}\nTrack: ${department} (${year})`
  };

  try {
    // Send email using Nodemailer
    await transporter.sendMail(mailOptions);
    
    // TODO: Add database saving logic here for your Admin Portal!
    
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.toString() });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
