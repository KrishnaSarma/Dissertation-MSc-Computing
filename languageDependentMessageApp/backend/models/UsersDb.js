import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    email: String
});

module.exports = mongoose.model("Users", usersSchema);