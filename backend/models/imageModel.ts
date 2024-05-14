import mongoose from "mongoose";

interface monSchema  {
  user: mongoose.Schema.Types.ObjectId;
  trackID: mongoose.Schema.Types.ObjectId;
  s3ImageURL: String;
  section: String;
  file: mongoose.Schema.Types.Mixed;
}

const imageSchema = new mongoose.Schema<monSchema>(
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

export default mongoose.model("Image", imageSchema);
