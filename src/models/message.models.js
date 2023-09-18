import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    user: {
        type: String, 
        require: true, 
        unique:true
    }, 
    messages: [{
        date: {
            type: Date,
            default: Date.now,
        },
        message: String,
    }]
    },
    {versionKey: false})
    

export const messageModel = model('messages', messageSchema);