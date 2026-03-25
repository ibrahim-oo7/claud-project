require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());
const userModel = require("./Model");
const jwt = require('jsonwebtoken');
// const {authentificat} = require('./middleware');
const SECRET = process.env.JWT_SECRET || 'secret_key';
// const bcrypt = require('bcrypt');


port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});