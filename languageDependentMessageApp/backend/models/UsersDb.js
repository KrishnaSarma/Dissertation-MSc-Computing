import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    email: String,
    password: String,
    language: {type: String, default: "En" }
});

module.exports = mongoose.model("users", usersSchema);