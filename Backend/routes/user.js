const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const USER = require("../models/user");
const crypto = require("crypto");
const ORDER = require("../models/order");

const { CheckforAuthCookie } = require("../middlewares/auth");
const { validateToken, generateTokenForUser } = require("../services/auth");

router.use(CheckforAuthCookie("token"));

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await USER.matchPasswordandGenerateToken(email, password);
    if (token.error === "User Not Found!") {
      return res.status(400).send({ error: "User Not Found" });
    }
    if (token.error === "Wrong Password!") {
      return res.status(400).send({ error: "Incorrect Password, Try Again!" });
    }
    return res.cookie("token", token).status(200).send({ token, success: "Login Successful!" });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password, mobile, Address } = req.body;
  try {
    await USER.create({
      fullName,
      email,
      password,
      mobile,
    });
    return res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    if (err.code === 11000) {
      console.log("Duplicate User Found !");
      return res.status(400).send({ error: "Email Already Exists!" });
    }
    return res.status(500).send({ error: err.message });
  }
});

router.get("/signout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/user/delete", async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = validateToken(token);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await USER.findOneAndDelete({ _id: user._id });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
}; 

router.post("/user/add-order", async (req, res) => {

  const { name, price, delivery_address, quantity, image , payment_method,item} = req.body;

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userId = validateToken(token)._id;

    const user = await USER.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const order = await ORDER.create({
      name,
      price,
      delivery_address,
      quantity,
      image,
      payment_method,
      user: userId  ,
      item
    });

    user.RecentOrders.push(order._id);
    await user.save();
    // Generate OTP 
    const otp = generateOTP();
    order.otp = otp;
    await order.save();

    
    
    const transporter = nodemailer.createTransport({
        service:'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: "mahakumbhlostfound@gmail.com", // Your email
            pass: "oevg lizk taxf hkrj", // Your email's app-specific password
        },
    });

    const mailOptions = {
        from: 'mahakumbhlostfound@gmail.com', // Replace with your email
        to: user.email, // User's email
        subject: 'Your OTP for Order Confirmation',
        text: `Your OTP for confirming your order is ${otp}.`,
    };
    
    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "Order added successfully", order });
  } catch (err) {
    console.error("Error adding order:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post('/user/update', async (req, res) => {
  try {
    const { _id, fullName, email, mobile } = req.body;

    if (!_id) {
      return res.status(400).json({ error: 'User ID (_id) is required' });
    }

    const updatedUser = await USER.findByIdAndUpdate(
      _id,
      { fullName, email, mobile },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server Error' });
  } 
});




router.get("/user", async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await USER.findOne({ _id: validateToken(token)._id }).populate('RecentOrders');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      RecentOrders: user.RecentOrders,
    });
  } catch (err) {
    console.error("Error validating token:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/users", async (req, res) => {

  try {
    const users = await USER.find({}, { password: 0 });
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    return res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/orders", async (req, res) => {

  try {
    const orders = await ORDER.find({}).populate("user");
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    return res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
