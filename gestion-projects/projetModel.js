const mongoose = require("mongoose");
const { Schema } = mongoose;

const projetModel = new Schema({
    nom : {
        type : String,
        required : true 
    },
    description : {
        type : String,
        required : true 
    },
    date_debut : {
        type : Date,
        required : true
    },
    date_fin : {
        type: Date,
        required : true 
    },
    statut : {
        type : String,
        required : true
    },
    owner : {
        type : String,
        required : true,
    },
    members : {
        type : [String],
        required : true,
    },
    categorie_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Categorie",
        required : true
    }
});

module.exports = mongoose.model("Projet",projetModel);
