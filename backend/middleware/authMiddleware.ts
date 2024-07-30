import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

interface ExRequest extends Request {
  user?: any;
}

interface ExResponse extends Response {
  user?: any;
}

declare module "express-session" {
  interface SessionData {
    userID?: string;
  }
}

const protect = asyncHandler(async (req: ExRequest, res: ExResponse, next) => {
  let sessionID = req.session.userID;
  // let sessionID = req.session.userID;

  if (sessionID) {
    try {
      req.user = await User.findById(sessionID).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized");
  }
});

export { protect };
