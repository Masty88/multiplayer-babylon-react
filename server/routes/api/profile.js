const express = require('express');
const router = express.Router();
require('dotenv').config();

const User = require('../../models/User');

//@route POST api/users
//@desc  Register user
//@access Public
router.get('/', (req,res)=>{
    res.send('profiles routes')
})

module.exports = router;
