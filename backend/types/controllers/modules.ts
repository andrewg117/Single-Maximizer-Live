import express from "express";

declare module "express-session" {
  export interface SessionData {
    userID?: string;
    error?: string;
  }
}