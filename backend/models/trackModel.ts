import mongoose from "mongoose";

interface monSchema extends mongoose.Document {
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

const trackSchema = new mongoose.Schema<monSchema>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    trackTitle: {
      type: String,
      trim: true,
      required: [true, "Add track title"],
    },
    artist: {
      type: String,
      trim: true,
      required: false,
    },
    deliveryDate: {
      type: Date,
      required: false,
    },
    spotify: {
      type: String,
      required: false,
    },
    features: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    apple: {
      type: String,
      required: false,
    },
    producer: {
      type: String,
      required: false,
    },
    scloud: {
      type: String,
      required: false,
    },
    album: {
      type: String,
      required: false,
    },
    trackLabel: {
      type: String,
      required: false,
    },
    ytube: {
      type: String,
      required: false,
    },
    albumDate: {
      type: Date,
      required: false,
    },
    genres: {
      type: Array,
      required: false,
    },
    trackSum: {
      type: String,
      required: false,
    },
    pressSum: {
      type: String,
      required: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
      required: false,
    },
    s3ImageURL: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    s3AudioURL: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    s3PressURL: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Track = mongoose.model<monSchema>("Track", trackSchema);
export default Track;