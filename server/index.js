const express= require('express');
const app = express();
const http = require('http');
const cors= require('cors');
const { Server }=require('socket.io')

app.use(cors());

const server= http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
})


const players={}

io.on("connection",(socket)=>{
    console.log(`User connected ${socket.id}`);
    socket.emit("GetId", {id: socket.id})
    socket.on("signalSend",()=>{
        console.log(`The server with id ${socket.id} send you a signal`)
    })
    socket.on("playerCreation",
        (data) => {
            console.log(`Player created with ${data.id}`)
            players[data.id] = data;
            socket.broadcast.emit("newPlayerCreated", data)
        })

})

server.listen(4000,()=>{
    console.log("Server running...")
})
