const mongoose = require('mongoose')
const {Schema} = mongoose

const NotificationSchema = new Schema({
    projectId : {type:String},
    text :{type:String},
    createdAt: { type: Date, default: Date.now }
})
const Notification = mongoose.model('Notification',NotificationSchema)

module.exports = Notification