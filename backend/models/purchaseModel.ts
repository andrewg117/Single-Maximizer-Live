import mongoose from "mongoose";
import { type purchaseSchemaTypes } from "../types/models/interfaces";

// TODO: Move track allowance tracking to purchase
const purchaseSchema = new mongoose.Schema<purchaseSchemaTypes>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    session: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Purchase = mongoose.model<purchaseSchemaTypes>(
  "Purchase",
  purchaseSchema
);
export default Purchase;
