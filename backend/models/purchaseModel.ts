import mongoose from "mongoose";

interface monSchema extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  session: mongoose.Schema.Types.Mixed;
}

const purchaseSchema = new mongoose.Schema<monSchema>(
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

const Purchase = mongoose.model<monSchema>("Purchase", purchaseSchema);
export default Purchase;
