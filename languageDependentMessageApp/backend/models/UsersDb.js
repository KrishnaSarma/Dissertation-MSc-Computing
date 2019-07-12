import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/my_chat_app');

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const Users = new Schema({
    email: String
});

module.exports = mongoose.model('Users', Users);
