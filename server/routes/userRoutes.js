const express = require('express')
const router = express.Router()
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const { check, validationResult} = require('express-validator')

const User = require('../models/userModel')


//@route POST api/users
//@desc  Register user
//@access Public
router.post('/',    [
    check('username', 'username is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6}),
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {username, email, password} = req.body

    try {
        let user = await User.findOne({email});

        if(user){
            return  res.status(400).json({ errors: [{msg: "User already exist"}]})
        }

        user = new User({
            username,
            email,
            password,
        })

        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt)

        await user.save()

        const payload ={
            user:{
                id: user.id
            }
        }

        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:36000},(err, token)=>{
            if(err) throw err;
            res.json({success: true, token, user: user})
        })

    }catch (err) {
        console.log(err.message);
        return res.status(500).send('Server error')
    }
    })



module.exports = router
