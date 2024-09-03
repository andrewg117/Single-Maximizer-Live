import mongoose from "mongoose";
import { userSchemaTypes } from "../types/models/interfaces";

const userSchema = new mongoose.Schema<userSchemaTypes>(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Add username"],
    },
    email: {
      type: String,
      required: [true, "Add email"],
      trim: true,
      unique: true,
    },
    encEmail: {
      type: Object,
      required: false,
      trim: true,
      unique: true,
    },
    googleId: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Add password"],
      trim: true,
    },
    isDefaultPass: {
      type: Boolean,
      default: true,
      trim: true,
    },
    fname: {
      type: String,
      required: [true, "Add first name"],
      trim: true,
    },
    lname: {
      type: String,
      required: [true, "Add last name"],
      trim: true,
    },
    website: {
      type: String,
      required: false,
    },
    scloud: {
      type: String,
      required: false,
    },
    twitter: {
      type: String,
      required: false,
    },
    igram: {
      type: String,
      required: false,
    },
    fbook: {
      type: String,
      required: false,
    },
    spotify: {
      type: String,
      required: false,
    },
    ytube: {
      type: String,
      required: false,
    },
    tiktok: {
      type: String,
      required: false,
    },
    bio_text: {
      type: String,
      required: false,
    },
    trackAllowance: {
      type: Number,
      required: false,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    stripeID: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<userSchemaTypes>("User", userSchema);
export default User;
