import mongoose from "mongoose";
import { type distroSchemaTypes } from "../types/models/interfaces";

const distroSchema = new mongoose.Schema<distroSchemaTypes>({
  email: {
    type: Object,
    required: true,
    trim: true,
    unique: false,
  },
  fname: {
    type: String,
    required: false,
    trim: true,
  },
  lname: {
    type: String,
    required: false,
    trim: true,
  },
  tags: {
    type: Array<string>,
    required: false,
  },
});

const Distro = mongoose.model<distroSchemaTypes>("Distro", distroSchema);
export default Distro;
