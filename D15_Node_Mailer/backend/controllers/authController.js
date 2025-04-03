const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// 📌 Register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    await user.save();
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(201).json({ message: "User registered", token });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// 📌 Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// 📌 Logout
exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

// 📌 Forgot Password (Send Reset Link)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Store token in DB
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 15 * 60 * 1000; // 15 mins expiration
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Stunning HTML email template with modern UI
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Password Reset</title>
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #eef2f3;
                  font-family: 'Arial', sans-serif;
                  animation: fadeIn 1s ease-in-out;
              }
              @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
              }
              .email-container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  border-radius: 12px;
                  padding: 30px;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                  text-align: center;
              }
              h2 {
                  color: #1d3557;
                  font-size: 24px;
                  font-weight: bold;
              }
              p {
                  color: #444;
                  font-size: 16px;
                  line-height: 1.6;
              }
              .button-container {
                  margin: 20px 0;
              }
              .reset-button {
                  display: inline-block;
                  padding: 14px 28px;
                  font-size: 18px;
                  color: #ffffff;
                  background: linear-gradient(to right, #457b9d, #1d3557);
                  text-decoration: none;
                  border-radius: 8px;
                  transition: all 0.3s ease-in-out;
                  font-weight: bold;
              }
              .reset-button:hover {
                  background: linear-gradient(to right, #1d3557, #457b9d);
                  transform: scale(1.05);
              }
              .footer {
                  margin-top: 25px;
                  color: #777;
                  font-size: 14px;
              }
              .logo {
                  max-width: 120px;
                  margin-bottom: 15px;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <img src="https://yourcompany.com/logo.png" class="logo" alt="Your Company Logo">
              <h2>Password Reset Request</h2>
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it.</p>
              <div class="button-container">
                  <a href="${resetLink}" class="reset-button">Reset Password</a>
              </div>
              <p>If you did not request this, please ignore this email. This link will expire in 15 minutes.</p>
              <hr>
              <p class="footer">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password - Your Company",
      html: emailTemplate,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// 📌 Reset Password (Update Password)
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiration: { $gte: Date.now() }, // Fix: use `$gte` to check expiry
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetToken = null;
    user.resetTokenExpiration = null;

    await user.save();
    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};
