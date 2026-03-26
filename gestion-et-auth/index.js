require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());
const userModel = require("./Model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.JWT_SECRET || "secret_key";
const {authentificat,onlyAdmin} = require('./middleware');
const cors = require('cors');
app.use(cors());

mongoose.connect('mongodb://localhost:27017/projetClaudAuth');
const db = mongoose.connection;
db.on('err' , (err) => console.log(`error connecting to database ${err}`));
db.once("open" , () => console.log('connected to databse'));


app.post("/login", async (req,res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    if(!user){
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    if(user.isBlocked){
        return res.status(403).json({message : "had user mnlocki mskin"})
    }

    const token = jwt.sign(
        { id: user._id, role : user.role },
        SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        message: 'Bienvenue!',
        token: token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
});

app.post('/register' , async (req,res) =>{
    const {username,email,password,role} = req.body;
    const existingOne = await userModel.findOne({email : email});
    if(existingOne){
        return res.status(400).json({message : 'L\'email existe déjà.'})
    }
    // const salt = await bcrypt.genSalt(10);
    // const hashedpassword = await bcrypt.hash(password,salt);

    const newUser = new userModel({
        id : Date.now(),
        username : username,
        email : email,
        password : password,
        role: role,
        isBlocked: false
    })
    await newUser.save();

    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        message : 'Utilisateur enregistré avec succès.',
        token,
        user: {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        }
    });
})

app.get('/users',authentificat,async (req,res) => {
    const users = await userModel.find();
    return res.json(users);
})

app.post('/add',authentificat,onlyAdmin, async(req,res) => {
    const newUser = new userModel(req.body);
    await newUser.save();
    return res.json(newUser);
})

app.put('/update/:id',authentificat,onlyAdmin, async(req,res) => {
    const update = await userModel.findByIdAndUpdate(req.params.id,{
        username : req.body.username ,
        email : req.body.email ,
        password : req.body.password ,
        role : req.body.role
    },{new : true})
    return res.json(update);
});

app.delete('/delete/:id',authentificat,onlyAdmin, async (req,res) => {
    await userModel.deleteOne({_id : req.params.id});
    return res.json('mchaa');
});

app.get('/searchUsername/:username',authentificat, async (req,res) => {
    const users = await userModel.find({username : req.params.username});
    return res.json(users);
});

app.get('/searchEmail/:email',authentificat, async (req,res) => {
    const users = await userModel.find({email : req.params.email});
    return res.json(users);
});

app.get('/searchRole/:role',authentificat, async (req,res) => {
    const users = await userModel.find({role : req.params.role});
    return res.json(users);
});

app.put("/block/:id", authentificat, onlyAdmin, async (req,res) => {

    const user = await userModel.findByIdAndUpdate(
        req.params.id,
        { isBlocked: true },
        { new: true }
    )
    res.json(user)
})

app.put("/unblock/:id", authentificat, onlyAdmin, async (req,res) => {

    const user = await userModel.findByIdAndUpdate(
        req.params.id,
        { isBlocked: false },
        { new: true }
    )
    res.json(user)
})

port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});