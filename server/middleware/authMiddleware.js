const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{
    //Get token from headers
    const token = req.header('x-auth-token')
    //check if not token
    if(!token){
        return res.status(401).json({msg: 'No token, authorization denied'})
    }

    //Verifiy token
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user
        next();
    }catch (err){
        return res.status(401).json({msg:'Token is not valid'})
    }
}
