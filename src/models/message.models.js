import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    user: {
        type: String, 
        require: true, 
        unique: true,
    }, 
    date: {
        type: Date,
        default: Date.now
    },
    menssage: String
    
})

export const messageModel = model('messages', messageSchema);