const express = require('express')
const { createServer } = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv').config()
const cors= require('cors')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const User = require('./models/userModel');
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 8000

connectDB()


const app = express()
const httpServer= createServer(app);

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/profile', require('./routes/profileRoutes'))

app.use(errorHandler)


const io = new Server(httpServer,{
    serveClient: false,
    cors:{
        origin: "http://localhost:3000",
    }
})

// io.use(async (socket, next) => {
//     try {
//         const { token } = socket.handshake.auth;
//         console.log(token)
//         const {id} = await jwt.verify(token, process.env.JWT_SECRET );
//         const user = await User.findOne({ id });
//         socket.user= user
//         next();
//     }
//     catch(err) {
//         console.log(err)
//         next(new Error('Not authenticated'));
//     }
// });

const players={}

io.on('connect', socket => {
    console.log('connected');
    socket.on("join_start_town", (room)=>{
        socket.join(room)
        console.log(`User with ${socket.id} joined room ${room}`)
    })
    socket.on("playerCreated",(data)=>{
        console.log(`new Player Created with ${data.id}`)
        players[data.id]=data;
        socket.to(data.room).emit("newPlayerCreated", data)

        for(let key in players){
            if(key === socket.id) continue;
            socket.emit("newPlayerCreated", players[key])
        }
    })
    socket.on("playerMove",(data)=>{
        players[data.id]= data;
        socket.to(data.room).emit("anotherPlayerMove",data)
    })
    socket.on("playAnimation", (data)=>{
        console.log(data)
        players[data.id]= data;
        socket.to(data.room).emit("anotherPlayerAnimated",data)
    })

    socket.on("logout",data=>{
        console.log('User Disconnect', socket.id)
        delete (players[socket.id])
    })
    socket.on("disconnect",  (data)=> {
        console.log('User Disconnect', socket.id)
        delete (players[socket.id])
    });

});


httpServer.listen(port, () => console.log(`Server started on port ${port}`))
