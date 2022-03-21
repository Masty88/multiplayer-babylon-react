const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,'Please add the username']
    },
    email:{
        type: String,
        required: [true,'Please add the email'],
        unique: true,
    },
    password:{
        type: String,
        required: [true,'Please add a password']
    },
    connected:{
        type: Boolean,
    }
},{
    timestamps: true
})

module.exports = User = mongoose.model('user', UserSchema);
