import mongoose from "mongoose";
import {type imageSchemaTypes} from "../types/models/interfaces";


const imageSchema = new mongoose.Schema<imageSchemaTypes>(
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
    s3ImageURL: {
      type: String,
      required: false,
    },
    section: {
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

const Image = mongoose.model<imageSchemaTypes>("Image", imageSchema);
export default Image;
