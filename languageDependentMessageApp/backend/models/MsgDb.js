import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// const ObjectId = Schema.ObjectId;

const chatSchema = new Schema({
    text: String,
    sender: {type: Schema.Types.ObjectId, ref: 'users'},
    reciever: {type: Schema.Types.ObjectId, ref: 'users'},
    reciever_text: String,
    delivered: Boolean,
    dateTime: {type: Date, default: Date.now }
});

module.exports = mongoose.model('messages', chatSchema);