import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const chatSchema = new Schema({
    text: String,
    sender: {type: Schema.Types.ObjectId, ref: 'Users'},
    reciever: {type: Schema.Types.ObjectId, ref: 'Users'},
    dateTime: {type: Date, default: Date.now }
});

module.exports = mongoose.model('messages', chatSchema);