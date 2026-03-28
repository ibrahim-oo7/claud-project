require('dotenv').config()
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5000
app.use(cors());
app.use(express.json());


const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


const db = mongoose.connection
mongoose.connect(process.env.URL_MONGOOSE)
db.on('error',(err)=> console.log(`error ${err}`)) 
db.once('open',()=> console.log('MongoDB connected'))


const Message = require('./MessageModels')
const Notification = require('./NotificationModels')


io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinProject", (projectId) => {
        socket.join(projectId);
        console.log(`User joined project ${projectId}`);
    });

    socket.on("sendMessage", async (data) => {
        const message = await Message.create(data);

        socket.to(data.projectId).emit("receiveMessage", message);

        const notif = { projectId: data.projectId, text: `${data.user} a envoyé un message` };
        await Notification.create(notif);
        socket.to(data.projectId).emit("notification", notif);
    });
});



app.get("/messages/:projectId", async (req, res) => {
  const messages = await Message.find({ projectId: req.params.projectId });
  res.json(messages);
});

app.get("/notifications/:projectId", async (req, res) => {
  const notifs = await Notification.find({ projectId: req.params.projectId });
  res.json(notifs);
});


app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  res.json({ path: `/uploads/${req.file.filename}` });
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

server.listen(PORT,()=>{
    console.log(`le serveur est en cours d excution sur http://localhost:${PORT}`)
})