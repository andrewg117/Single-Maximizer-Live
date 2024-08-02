import mongoose from "mongoose";
import { emailSchemaTypes } from "../types/models/interfaces";

const emailSchema = new mongoose.Schema<emailSchemaTypes>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    trackID: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Track",
    },
    deliveryDate: {
      type: Date,
      required: false,
    },
    recipient: {
      type: String,
      required: [true, "Add recipient"],
    },
    subject: {
      type: String,
      required: [true, "Add subject"],
    },
    emailMessage: {
      type: String,
      required: [true, "Add message"],
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model<emailSchemaTypes>("Email", emailSchema);
export default Email;
