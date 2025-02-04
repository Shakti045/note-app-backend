import { configDotenv } from "dotenv";
import jwt from 'jsonwebtoken';
configDotenv();

export const authenticate = (req,res,next)=>{
    try{
    const token = req.body.token || req.header("Authorization").replace("Bearer ", "") ||  req.cookies.authToken ;
    if(!token){
        return res.status(400).json({
            "Success":false,
            "Message":"Unauthorised login"
        })
    }
    const decoded=jwt.decode(token);
    const exppirationtime=decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000)
     if(currentTime>exppirationtime){
        return res.status(404).json({
            Success:false,
            Message:"Session expired kindly relogin"
        })
     }
    const payload=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    req.body.userId=payload.userId;
    next();
   }catch(err){
    console.log("Error while authenticating the user","=>",err);
      res.status(500).json({
        "Success":false,
        "Message":"Error while authenticating the user"
      })
  }
}
