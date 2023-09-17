import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    user: {
        type: String, 
        require: true, 
    }, 
    date: {
        type: Date,
        default: Date.now,
    },
    message: String,
    },
    {versionKey: false})
    

export const messageModel = model('messages', messageSchema);