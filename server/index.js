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
io.on('connect', socket => {
    console.log('connected');
});


httpServer.listen(port, () => console.log(`Server started on port ${port}`))
