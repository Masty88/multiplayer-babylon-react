const express= require('express');
const connectDB = require('../server/config/connectDb')
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config()

const app = express();

//Connect Database
connectDB();
app.use(cors());
app.use(express.json())

app.get('/', (req,res)=>res.send("Api running"))

//Define Routes
app.use('/api/users', require('./routes/api/users'));
// app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/profile', require('./routes/api/profile'));


const httpServer= createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin: "http://localhost:3000",
    }
})


// const players={}
//
// io.on("connection",(socket)=>{
//     console.log(`User connected ${socket.id}`);
//     socket.on("playerCreated",(data)=>{
//         console.log(`new Player Created with ${data.id}`)
//         players[data.id]=data;
//         socket.broadcast.emit("newPlayerCreated", data)
//
//         for(let key in players){
//             if(key === socket.id) continue;
//             socket.emit("newPlayerCreated", players[key])
//             console.log("another",players[key])
//         }
//     })
//     socket.on("disconnect",  (data)=> {
//         console.log('User Disconnect', socket.id)
//         delete (players[socket.id])
//     });
//
//     socket.on("playerMove",(data)=>{
//         players[data.id]= data;
//         console.log(data)
//        socket.broadcast.emit("anotherPlayerMove",data)
//     })
//
// })



const PORT = process.env.PORT || 5000;

httpServer.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`)
})
