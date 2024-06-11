import session, { SessionData } from "express-session";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import axios from "axios";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { generate } from "generate-password";
import User from "../models/userModel";
import { ObjectId } from "mongoose";
const EMAILUSER = <string>process.env.EMAILUSER;
const MAILGUN_API = <string>process.env.MAILGUN_API;

dotenv.config();
const GOOGLE_OATH_SECRET = <string>process.env.GOOGLE_OATH_SECRET;
const GOOGLE_CLIENT_ID = <string>process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI: string = "http://localhost:5000/api/users/redirect/google";

const NODE_ENV = <string>process.env.NODE_ENV;
const RENDER_STATIC_URL = <string>process.env.RENDER_STATIC_URL;
const API_URL =
  NODE_ENV === "production" ? RENDER_STATIC_URL : "http://localhost:3000";

// Mailgun email setup
const mailgun: Mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: MAILGUN_API });
const mgDomain: string = "mail.trackstarz.com";

interface urlType {
  client_id: string;
  client_secret: string;
  code: any;
  redirect_uri: string;
  grant_type: string;
}

interface JwtPayload {
  id: string;
}

declare module "express-session" {
  export interface SessionData {
    userID: string;
  }
}

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { fname, lname, username, email, password } = req.body;

  try {
    if (!fname || !lname || !username || !email || !password) {
      res.status(400);
      throw new Error("Add all fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User exists, use a different email or login");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fname,
      lname,
      username,
      email,
      password: hashedPassword,
    });

    // if (user) {
    //   generateToken(res, user._id, "10m");

    //   res.status(201).json({
    //     _id: user.id,
    //     fname: user.fname,
    //     lname: user.lname,
    //     username: user.username,
    //     email: user.email,
    //     isAdmin: user.isAdmin,
    //   });
    // } else {
    //   res.status(400);
    //   throw new Error("Invalid user data");
    // }
    req.session.userID = user._id;
    res.status(200).end();
  } catch (error) {
    throw new Error(error as string);
  }
});

// @desc    Email new user
// @route   POST /api/users/email
// @access  Public
const checkRegisterEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExists = await User.findOne({ email });
  // console.log(userExists)

  if (userExists) {
    res.status(409);
    throw new Error("User exists, use a different email or login");
  }

  const token = makeToken(email, "2m");

  const link = `${API_URL}/home/signup/${token}`;

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: email, // list of receivers
    subject: "Register Account", // Subject line
    text: "Continue creating your account: " + link, // plain text body
    html: `<p>Continue creating your account:</p><p>${link}</p>`, // html body
  };

  mg.messages
    .create(mgDomain, mailOptions)
    .then((msg) => console.log(msg))
    .catch((err) => console.error(err));

  // console.log('Message sent: %s', info.messageId)

  res.status(200).json("Email sent");
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, token } = req.body;

  try {
    const user = (await User.findOne({ email })) as any;

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPT_SECRETKEY}&response=${token}`
    );

    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      response.data.success
    ) {
      // generateToken(res, user._id, "10m");
      req.session.userID = user._id as string;

      const userBody = {
        ...user["_doc"],
      };
      delete userBody["password"];
      delete userBody["__v"];

      res.json({
        ...userBody,
      });
    } else {
      res.status(401);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.log(error);
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// @desc    Forgot Password
// @route   POST /api/users/forgot
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  // console.log(user)

  if (!user) {
    res.status(409);
    throw new Error("User does not exists, use a different email or login");
  }

  const token = makeToken(user.email as string, "10m");

  const link = `${API_URL}/home/resetpass/${token}`;

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: email, // list of receivers
    subject: "Forgot Password", // Subject line
    text: "Hello " + user.username + ",\n Reset Password: \n" + link, // plain text body
    html: `<p>Hello ${user.username},</p><p>Reset Password:</p><p>${link}</p>`, // html body
  };

  mg.messages
    .create(mgDomain, mailOptions)
    .then((msg) => res.status(200).json(msg))
    .catch((err) => res.status(409).json(err));

  // console.log('Message sent: %s', info.messageId)

  // res.status(200).json(info)
});

// @desc    Update user password
// @route   PUT /api/users/reset
// @access  Private
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  let email;

  try {
    const decoded = decodeToken(token) as JwtPayload;
    email = decoded.id as string; //TODO: Fix JWT for TS
  } catch (error) {
    res.status(401);
    throw new Error(
      error === "TokenExpiredError: jwt expired"
        ? "Login Expired"
        : (error as string)
    );
  }

  const user = await User.findOne({ email });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let updatedUser;

  updatedUser = await User.findByIdAndUpdate(
    user?._id as ObjectId,
    { password: hashedPassword },
    {
      new: true,
    }
  );

  res.json(updatedUser);
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.session.userID) as any;

    if (user) {
      const userBody = {
        ...user,
      };
      delete userBody["__v"];
      delete userBody["password"];
      delete userBody["googleId"];
      res.json(userBody);
    }
  } catch (error) {
    throw new Error("Login Expired");
  }
});

// @desc    Update user data
// @route   PUT /api/users/
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  try {
    if (!req.session.userID) {
      res.status(401);
      throw new Error("User not found");
    }

    let updatedUser;

    updatedUser = await User.findByIdAndUpdate(req.session.userID, req.body, {
      new: true,
    });

    res.json(updatedUser);
  } catch (error) {
    throw new Error("Login Expired");
  }
});

// @desc    Get email data
// @route   GET /api/users/email
// @access  Private
const emailData = asyncHandler(async (req, res) => {
  const { token } = req.params;
  // console.log(token)
  try {
    const decoded = decodeToken(token);
    res.json(decoded);
  } catch (error) {
    res.status(401);
    throw new Error(
      error === "TokenExpiredError: jwt expired"
        ? "Login Expired"
        : (error as string)
    );
  }
});

// @desc    Get user data
// @route   GET /api/users/token
// @access  Private
// const checkUserToken = asyncHandler(async (req, res) => {
//   let token = req.cookies.jwt;
//   if (token) {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const currentTime = Date.now() / 1000;

//     const isExpired = decoded.exp < currentTime;
//     if (isExpired) {
//       res.status(401).json(401);
//     } else {
//       res.status(200).json("Token");
//     }
//   } else {
//     res.status(401).json(401);
//   }
//   // res.json(req.user)
// });

// @desc    Wake up demo server
// @route   GET /api/users/wakeserver
// @access  Private
// const wakeDemoServer = asyncHandler(async (req, res) => {
//   try {
//     res.json("Success");
//   } catch (error) {
//     res.status(400);
//     throw new Error(error);
//   }
// });

// Generate JWT
const makeToken = (id: string, expire: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: expire,
  });
};

// Decode JWT
const decodeToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

module.exports = {
  registerUser,
  checkRegisterEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateUser,
  getMe,
  emailData,
};
