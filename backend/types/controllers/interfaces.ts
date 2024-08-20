import { Request, Response } from "express";

export interface userType extends Document {
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

export interface ExRequest extends Request {
  user?: userType;
}

export interface ExResponse extends Response {
  user?: userType;
}

export interface FileRequest extends Request {
  body: any;
  file?: any;
  files?: any;
}

export interface StripeRequest extends Request {
  body: any;
  headers: any;
  user?: any;
  session_id?: string;
}

export interface urlType {
  client_id: string;
  client_secret: string;
  code: any;
  redirect_uri: string;
  grant_type: string;
}

export interface JwtPayload {
  id: string;
}