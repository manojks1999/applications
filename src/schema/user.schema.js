const mongoose = require("mongoose");
const { Schema, Types } = mongoose;


const userSchema = new Schema({
    userId: Types.ObjectId,
    email: String,
    password: String,
});

module.exports = mongoose.model("User", userSchema);