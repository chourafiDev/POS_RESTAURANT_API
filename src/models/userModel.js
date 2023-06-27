import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    address: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    image: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
      enum: ["Admin", "Cashier"],
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

// before save the user we should hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const saltRounds = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// chek the compare between the entered password and the password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
