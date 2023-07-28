import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);

export default History;
