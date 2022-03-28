const express = require('express');
const router = express.Router();
const  protect = require('../middleware/authMiddleware');
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const User = require('../models/userModel')
const Profile=require('../models/profileModel')

//@route GET api/profile/me
//@desc Get current user profile
//@access Private
router.get('/me',protect,async (req,res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user','-password');

        if(!profile){
            return res.status(400).json({msg:"There is no profile for this user"})
        }

        res.json(profile)

    }catch (err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

//@route POST api/profile
//@desc Create or update user profile
//@access Private
router.post('/',protect,
    [
        check('mesh',"Mesh is required").not().isEmpty(),
    ],
    async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()})
    }

    const{mesh,avatar,tutorial}= req.body;
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(mesh)profileFields.mesh= mesh;
    if(avatar)profileFields.avatar= avatar;
    if(tutorial)profileFields.tutorial=tutorial;

    try {
        //Check if profile exists
        let profile = await Profile.findOne({user: req.user.id})

        if(profile){
            //update
            profile = await Profile.findOneAndUpdate({user: req.user.id},
                {$set: profileFields},
                {new:true});
            return res.json(profile);
        }

        //Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    }catch (err){
        console.error(err.message);
        res.status(500).send('Server error')
    }

})


module.exports = router;
