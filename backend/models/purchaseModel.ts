import mongoose from "mongoose";
import { purchaseSchemaTypes } from "../types/models/interfaces";

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
