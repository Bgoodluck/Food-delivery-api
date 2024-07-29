import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;