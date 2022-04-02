const express = require('express')
const { createServer } = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv').config()
const cors= require('cors')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const User = require('./models/userModel');
const Profile = require('./models/profileModel');
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

io.use(async (socket, next) => {
    try {
        const { token, userConnected } = socket.handshake.auth;
        const decoded = await jwt.verify(token, process.env.JWT_SECRET );
        const user = decoded.user
        socket.user= user
        next();
    }
    catch(err) {
        console.log(err)
        next(new Error('Not authenticated'));
    }
});

const players={}


io.on('connect', socket => {
    const userId= socket.user.id;
    socket.on("join_start_town",async (data)=>{
        socket.join(data.room)
        //console.log(`User with ${socket.id} joined room ${data.room}`)
        await User.updateOne({_id:userId},{connected:true});
    })
    socket.on("playerCreated",(data)=>{
        players[data.id]=data;
        socket.to(data.room).emit("newPlayerCreated", data)
        for ( let key in players) {
                if(key === socket.id || players[key].room !== data.room) continue;
                socket.emit("newPlayerCreated", players[key])
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

    socket.on("logout",async data=>{
        socket.leave(data)
        delete players[socket.id];
        await User.updateOne({_id:userId},{connected:false});
        await Profile.updateOne({user:userId},{tutorial:false});
        socket.broadcast.emit("playerExit", socket.id)
    })
    socket.on("disconnect",  async (data)=> {
        await User.updateOne({_id:userId},{connected:false});
        await Profile.updateOne({user:userId},{tutorial:false});
        delete players[socket.id];
        socket.broadcast.emit("playerExit", socket.id)
        socket.disconnect()
    });

});


httpServer.listen(port, () => console.log(`Server started on port ${port}`))
