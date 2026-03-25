const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userModel = new Schema({
    username : {
        type : String,
        required : true 
    },
    email : {
        type : String,
        required : true 
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type: String,
        required : true 
    },
    isBlocked: {
        type: Boolean,
        default: false
}
});

userModel.pre('save' , async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

module.exports = mongoose.model("User",userModel);
