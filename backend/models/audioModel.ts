import mongoose from "mongoose";

interface monSchema extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  trackID: mongoose.Schema.Types.ObjectId;
  s3AudioURL: String;
  file: mongoose.Schema.Types.Mixed;
}

const audioSchema = new mongoose.Schema<monSchema>(
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

const Audio = mongoose.model<monSchema>("Audio", audioSchema);
export default Audio;
