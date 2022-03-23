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
    socket.on("join_start_town", (data)=>{
        socket.join(data.room)
        console.log(`User with ${socket.id} joined room ${data.room}`)
        // await User.findOneAndUpdate({id:data.userId},{connected:true})
    })
    socket.on("playerCreated",(data)=>{
        // console.log(`new Player Created with ${data.id} in ${data.room}`)
        players[data.id]=data;
        socket.to(data.room).emit("newPlayerCreated", data)
        const clients=io.sockets.adapter.rooms.get(data.room);
        const numClients = clients ? clients.size : 0;
        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);
            console.log(clientSocket.rooms)
                if(clientId === socket.id || players[clientId].room !== data.room ) continue;
                socket.emit("newPlayerCreated", players[clientId])
                console.log("here")
        }
    })
    socket.on("playerMove",(data)=>{
        players[data.id]= data;
        socket.to(data.room).emit("anotherPlayerMove",data)
    })
    socket.on("playAnimation", (data)=>{
        players[data.id]= data;
        socket.to(data.room).emit("anotherPlayerAnimated",data)
    })

    socket.on("logout",data=>{
        console.log('User Disconnect', socket.id)
        socket.leave(data)
        console.log('User leave', data)
        delete players[socket.id];
        socket.broadcast.emit("playerExit", socket.id)
    })
    socket.on("disconnect",  (data)=> {
        console.log('User Disconnect', socket.id)
        // await User.findOneAndUpdate({id:players[socket.id].userId},{connected:false})
        delete players[socket.id];
        socket.broadcast.emit("playerExit", socket.id)
    });

});


httpServer.listen(port, () => console.log(`Server started on port ${port}`))
