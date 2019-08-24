import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    email: { type : String , unique : true, dropDups: true },
    username: String,
    language: {type: String, default: "En" },
    topicName: String
});

module.exports = mongoose.model("users", usersSchema);