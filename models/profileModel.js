import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    address: String,
}, { minimize: false });

const profileModel = mongoose.models.profile || mongoose.model("profile", profileSchema);

export default profileModel;
