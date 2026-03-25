const mongoose = require("mongoose");
const { Schema } = mongoose;

const catModel = new Schema({
    nom : {
        type : String,
        required : true 
    },
    description : {
        type : String,
        required : true 
    }
});

module.exports = mongoose.model("Categorie",catModel);
