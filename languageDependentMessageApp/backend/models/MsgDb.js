import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/my_chat_app');

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const Chat = new Schema({
    text: String,
    sender: {type: Schema.Types.ObjectId, ref: 'Users'},
    reciever: {type: Schema.Types.ObjectId, ref: 'Users'},
    dateTime: {type: dateTime, default: dateTime.now }
});

module.exports = mongoose.model('Messages', Chat);