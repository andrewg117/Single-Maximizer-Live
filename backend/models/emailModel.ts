import mongoose from "mongoose";

interface monSchema extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  trackID: mongoose.Schema.Types.ObjectId;
  deliveryDate: Date;
  recipient: String;
  subject: String;
  emailMessage: String;
}

const emailSchema = new mongoose.Schema<monSchema>(
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

const Email = mongoose.model<monSchema>("Email", emailSchema);
export default Email;
