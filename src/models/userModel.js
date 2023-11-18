import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    phone: { type: String, required: true },
    access_token: { type: String },
    refresh_token: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", User);
