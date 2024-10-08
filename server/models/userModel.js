const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    job: { type: String },
    phone: { type: String },
    permissionLevel: { type: String, enum: ["Worker", "Manager", "CEO"], default: "Worker" },
    profileImage: { type: Buffer, contentType: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
