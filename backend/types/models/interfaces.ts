import mongoose from "mongoose";

export interface audioSchemaTypes extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  trackID: mongoose.Schema.Types.ObjectId;
  s3AudioURL: String;
  file: mongoose.Schema.Types.Mixed;
}

export interface emailSchemaTypes extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  trackID: mongoose.Schema.Types.ObjectId;
  deliveryDate: Date;
  recipient: String;
  subject: String;
  emailMessage: String;
}

export interface imageSchemaTypes extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  trackID: mongoose.Schema.Types.ObjectId;
  s3ImageURL: String;
  section: String;
  file: mongoose.Schema.Types.Mixed;
}

export interface purchaseSchemaTypes extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  session: mongoose.Schema.Types.Mixed;
}

export interface trackSchemaTypes extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  trackTitle: String;
  artist: String;
  deliveryDate?: Date;
  spotify?: String;
  features?: String;
  label?: String;
  apple?: String;
  producer?: String;
  scloud?: String;
  album?: String;
  trackLabel?: String;
  ytube?: String;
  albumDate?: Date;
  genres?: Array<String>;
  trackSum?: String;
  pressSum?: String;
  isDelivered?: Boolean;
  s3ImageURL?: mongoose.Schema.Types.Mixed;
  s3AudioURL?: mongoose.Schema.Types.Mixed;
  s3PressURL?: Array<String>;
}

export interface userSchemaTypes extends mongoose.Document {
  username: String;
  googleId?: String;
  isDefaultPass: Boolean;
  email: String;
  encEmail: Object;
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

export interface distroSchemaTypes extends mongoose.Document {
  email: Object;
  fname?: String;
  lname?: String;
  tags?: Array<string>;
}