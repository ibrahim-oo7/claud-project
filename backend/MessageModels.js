const mongoose = require('mongoose')

const {Schema} = mongoose

const MessageSchema = new Schema({
    projectId : {type:String,required:true},
    user :{type:String,required:true},
    content : {type:String},
    file : {type:String},
    createdAt: { type: Date, default: Date.now }
})
const Message = mongoose.model('Message',MessageSchema)

module.exports = Message