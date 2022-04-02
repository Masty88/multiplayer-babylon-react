//TODO add bonus game only one time in 24hours
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    mesh:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        required: true
    },
    tutorial:{
        type:Boolean
    }
})

module.exports= Profile = mongoose.model('profile', ProfileSchema)
