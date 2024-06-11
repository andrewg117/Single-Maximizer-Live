import mongoose from "mongoose";

interface monSchema extends mongoose.Document {
  username: String;
  googleId?: String;
  isDefaultPass: Boolean;
  email: String;
  password: String;
  fname: String;
  lname: String;
  website?: String;
  scloud?: String;
  twitter?: String;
  igram?: String;
  fbook?: String;
  spotify?: String;
  ytube?: String;
  tiktok?: String;
  bio_text?: String;
  trackAllowance?: Number;
  isAdmin?: Boolean;
  stripeID?: String;
}

const userSchema = new mongoose.Schema<monSchema>(
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

const User = mongoose.model<monSchema>("User", userSchema);
export default User;
