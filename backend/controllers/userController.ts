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
import { urlType, JwtPayload } from "../types/controllers/interfaces";
import  "../types/controllers/modules";

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

    if (user) {
      req.session.userID = user._id;
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
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

  const userExists = (await User.findOne({ email })) as any;
  // TODO: Test error handling  

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
      res.status(401).json("Invalid credentials");
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.log(error);
  }
});

// @desc    Authenticate Google user
// @route   POST /api/users/login
// @access  Private
const loginGoogle = asyncHandler(async (req, res) => {
  try {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;

    // TODO: use IP to limit login attempts
    // console.log(req.ip);
    // console.log(req.socket.remoteAddress);
    const { token } = req.body;

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPT_SECRETKEY}&response=${token}`
    );

    if (response.data.success) {
      res.json(url);
    } else {
      throw new Error("Captcha Failed");
    }
  } catch (error) {
    throw new Error("Login Expired: " + error);
  }
});

// @desc    Authenticate a Google user
// @route   GET /redirect/google
// @access  Private
const redirectGoogle = asyncHandler(async (req, res) => {
  const { code } = req.query;

  // try {
  const searchParams: urlType = {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_OATH_SECRET,
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  };

  // Exchange authorization code for access token
  const { data } = await axios.post(
    "https://oauth2.googleapis.com/token",
    searchParams
  );

  const { access_token, id_token } = data;
  // Use access_token or id_token to fetch user profile
  const { data: profile } = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );

  // Code to handle user authentication and retrieval using the profile data

  interface userDoc extends Document {
    _id?: string;
    googleId?: string;
  }
  // console.log(`googleUser: -------- \n ${JSON.stringify(profile)}`);

  await User.findOne({ googleId: profile.id }).then(async (googleUser) => {
    if (googleUser != null) {
      // console.log(`googleUser: -------- \n ${JSON.stringify(googleUser)}`);

      req.session.userID = googleUser._id;

      res.redirect("http://localhost:3000/profile");
    } else {
      await User.findOne({ email: profile.email }).then(async (user) => {
        // console.log(`user: -------- \n ${JSON.stringify(user)}`);
        if (user) {
          console.error("Error: Google email used in another account");
          // throw new Error("Google email used in another account");
          res
            .status(409)
            .redirect(
              "http://localhost:3000/home/signin?error=Google email used in another account"
            );
        } else {
          const salt = await bcrypt.genSalt(10);
          const defaulPass = generate({
            length: 12,
            numbers: true,
            symbols: true,
          });
          const hashedPassword = await bcrypt.hash(defaulPass, salt);

          const user = await User.create({
            username: profile.name,
            fname: profile.given_name,
            lname: profile.family_name,
            password: hashedPassword,
            email: profile.email,
            googleId: profile.id,
          });

          req.session.userID = user._id.toString();
          res.redirect("http://localhost:3000/profile");
        }
      });
    }
  });

  // } catch (error) {
  //   throw new Error("Google user not found");
  //   // res.redirect("http://localhost:3000/home/signin");
  // }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy(() => {
    res
      .clearCookie("connect.sid", { path: "/" })
      .status(200)
      .json({ message: "Logged out successfully" });
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
    email = decoded.id as string;
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
    const user = (await User.findById(req.session.userID)) as any;
    if (user) {
      const userBody = {
        ...user,
      };
      delete userBody["__v"];
      delete userBody["password"];
      delete userBody["googleId"];
      res.json(userBody["_doc"]);
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
const decodeEmailToken = asyncHandler(async (req, res) => {
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
const checkUserToken = asyncHandler(async (req, res) => {
  let token = req.session.userID;
  if (token) {
    res.status(200).json("Token");
  } else {
    res.status(401).json("Invalid Token");
  }
  // res.json(req.user)
});

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

export {
  registerUser,
  checkRegisterEmail,
  loginUser,
  loginGoogle,
  redirectGoogle,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateUser,
  getMe,
  decodeEmailToken,
  checkUserToken,
};
