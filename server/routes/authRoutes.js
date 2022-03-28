const express = require('express');
const everyauth= require('everyauth')
const router = express.Router();
const protect  = require('../middleware/authMiddleware');
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/userModel')

//@route GET api/auth
//@desc Authenticate user
//@access Private
router.get('/',protect,async (req,res)=>{
    try {
        const token = req.header('x-auth-token')
        const user = await User.findById(req.user.id).select('-password');
        if(user.connected){
            return  res.status(400).json({ errors: [{msg: "Game already open in an other terminal"}]})
        }
        res.json({user,token})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

//@route GET api/auth/logout
//@desc Set user not connected
//@access Private
router.get('/logout',protect,async (req,res)=>{
    try {
        const token = req.header('x-auth-token')
        await User.findOneAndUpdate({_id:req.user.id}, {connected:false})
        res.json({token})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

//@route POST api/auth
//@desc  Authenticate and get Token
//@access Public
router.post('/',[
    check('email','Please enter an email').isEmail(),
    check('password','Password is required').exists(),
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body

    try {
        let user = await User.findOne({email});

        if(!user){
            return  res.status(400).json({ errors: [{msg: "Invalid credentials"}]})
        }

        //Match user and password
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return  res.status(400).json({ errors: [{msg: "Invalid credentials"}]})
        }


        if(user.connected){
            return  res.status(400).json({ errors: [{msg: "Game already open in an other terminal"}]})
        }

        const payload ={
            user:{
                id: user.id,
                username: user.username,
                connected: user.connected
            }
        }

        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2 days"},(err, token)=>{
            if(err) throw err;
            res.json({success:true, token,user})
        })

    }catch (err){
        console.log(err.message);
        return  res.status(500).send('Server error')
    }
})

module.exports = router;
