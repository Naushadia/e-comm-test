const db = require("../models");

const User = db.user;
const { error, success } = require("../utils/responseWrapper");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { validationResult, Result } = require("express-validator");

const generateToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.PRIVATE_KEY, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    console.error(error);
  }
};

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "napoleon77@ethereal.email",
    pass: "fXU951Yv9jHU7HJSJR",
  },
});

exports.registerController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { first_name, last_name, email, password, address } = req.body;

    if (!first_name || !last_name || !email || !password || !address) {
      return res.send(error(400, "All fields are required"));
    }

    const oldUser = await User.findOne({ where: { email } });
    if (oldUser) {
      return res.send(error(409, "User is already registered"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      address,
      verified: 0,
    });

    const accessToken = generateToken({ user });

    await transporter.sendMail({
        to: email,
        from: "shop@shadab.com",
        subject: "please verify your email",
        html: `<h3> Click this <a href="${req.protocol}://${req.headers.host}/auth/verify/${accessToken}">link</a> to verify your email</h3>`,
    })

    return res.send(success(201, { user, accessToken,"msg": "please verify your email" }));
  } catch (error) {
    console.error(error);
  }
};

exports.verifyEmailController = async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const token = req.params.token;
      try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (decoded) {
        const user = await User.findOne({ where: { id: decoded.user.id } });
        user.verified = 1;
        user.save();
        return res.send(success(200, "email verified"))
    }
      } catch { 
        return res.send(error(404, "Link Expired"))
      }
};

exports.loginController = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.send(error(400, "All fields are required"));
      }
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.send(error(404, "User is not registered"));
      }

      if (user.verified !== 1) {
        return res.send(error(404, "User email is not verified"))
      }
  
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return res.send(error(403, "Incorrect password"));
      }
  
      const accessToken = generateToken({ user });
  
      return res.send(
        success(200, {
            "msg":"User successfully logged in",
          accessToken,
        })
      );
    } catch (error) {
        console.error(error);
    }
  };
