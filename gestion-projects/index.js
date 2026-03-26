require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(cors());


app.use(express.json());
const {onlyAdmin,authentificat} = require('./middleware');
const projetModel = require("./projetModel");
const categorieModel = require("./categorieModel");

mongoose.connect('mongodb://localhost:27017/projetClaudGP');
const db = mongoose.connection;
db.on('err' , (err) => console.log(`error connecting to database ${err}`));
db.once("open" , () => console.log('connected to databse'));


// categorieModel.insertMany([
//     {
//         nom: "Web",
//         description: "Web development projects"
//     },
//     {
//         nom: "Mobile",
//         description: "Mobile applications"
//     },
//     {
//         nom: "AI",
//         description: "Artificial intelligence projects"
//     }
// ])

app.get('/projects',authentificat, async (req,res) => {
    const projects = await projetModel.find();
    return res.json(projects);
    
});
app.get('/categories' , async (req,res) => {
    const categories = await categorieModel.find();
    return res.json(categories);
})

app.post('/add',authentificat,onlyAdmin, async (req,res) => {
    const {nom, description, date_debut, date_fin, statut,owner,member, categorie_id} = req.body;

    const newProjet = new projetModel({
        nom: nom,
        description: description,
        date_debut: date_debut,
        date_fin: date_fin,
        statut: statut,
        owner : owner,
        members : member,
        categorie_id: categorie_id
    })
    await newProjet.save();
    res.json(newProjet);
});

app.put('/update/:id',authentificat, async(req,res) => {
    const id = req.params.id;
    const update = await projetModel.findByIdAndUpdate({_id : id},{
        nom: req.body.nom,
        description: req.body.description,
        date_debut: req.body.date_debut,
        date_fin: req.body.date_fin,
        statut: req.body.statut,
        categorie_id: req.body.categorie_id
    },{new : true})
    return res.json(update);
});

app.delete('/delete/:id',authentificat, async (req,res) => {
    await projetModel.deleteOne({_id : req.params.id});
    return res.json('mchaa');
});

app.get('/projects/:id',authentificat, async (req,res) => {
    const projet = await projetModel.findOne({_id : req.params.id});
    return res.json(projet);
});

app.get('/searchNom/:nom',authentificat, async (req,res) => {
    const projets = await projetModel.find({nom : req.params.nom});
    return res.json(projets);
});

app.get('/searchDebut/:date_debut',authentificat, async (req,res) => {
    const projets = await projetModel.find({date_debut : req.params.date_debut});
    return res.json(projets);
});

app.get('/searchFin/:date_fin',authentificat, async (req,res) => {
    const projets = await projetModel.find({date_fin : req.params.date_fin});
    return res.json(projets);
});

app.get('/searchStatut/:statut',authentificat, async (req,res) => {
    const projets = await projetModel.find({statut : req.params.statut});
    return res.json(projets);
});

port = 3004;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});