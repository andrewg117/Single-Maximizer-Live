import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import { userType, ExRequest, ExResponse } from "../types/controllers/interfaces";
import  "../types/controllers/modules";


const protect = asyncHandler(async (req: ExRequest, res: ExResponse, next) => {
  let sessionID = req.session.userID;
  // let sessionID = req.session.userID;

  if (sessionID) {
    try {
      req.user = (await User.findById(sessionID).select(
        "-password"
      )) as userType;

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
