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
    socket.on("playerCreated",(data)=>{
        console.log(`new Player Created with ${data.id}`)
        players[data.id]=data;
        socket.broadcast.emit("newPlayerCreated", data)

        for(let key in players){
            if(key === socket.id) continue;
            socket.emit("newPlayerCreated", players[key])
            console.log("another",players[key])
        }
    })
    socket.on("disconnect",  (data)=> {
        console.log('User Disconnect', socket.id)
        delete (players[socket.id])
    });

    socket.on("playerMove",(data)=>{
        players[data.id]= data;
       socket.broadcast.emit("anotherPlayerMove",data)
    })

})

server.listen(4000,()=>{
    console.log("Server running...")
})
