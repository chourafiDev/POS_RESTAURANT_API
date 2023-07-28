import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, "Number is required"],
      unique: true,
    },
    numberOfGuests: {
      type: Number,
      required: [true, "Number of guests is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required."],
      enum: {
        values: ["Available", "Booked", "Billed", "Occupied"],
        massage: "Please select the correct status",
      },
    },
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);

export default Table;
