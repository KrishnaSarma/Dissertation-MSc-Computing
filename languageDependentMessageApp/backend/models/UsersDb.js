import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    email: String,
    password: String
});

module.exports = mongoose.model("users", usersSchema);