import mongoose from "mongoose";
import {audioSchemaTypes} from "../types/models/interfaces";

const audioSchema = new mongoose.Schema<audioSchemaTypes>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    trackID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Track",
    },
    s3AudioURL: {
      type: String,
      required: false,
    },
    file: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Audio = mongoose.model<audioSchemaTypes>("Audio", audioSchema);
export default Audio;
