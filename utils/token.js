import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
configDotenv();

const access_secret = process.env.ACCESS_TOKEN_SECRET;
//const refresh_secret = process.env.REFRESH_TOKEN_SECRET;

export const generateaccesstoken = ({userId})=>{
    const token = jwt.sign({userId}, access_secret, { expiresIn: "7d" });
    return token;
}

export const verifyaccesstoken = (token)=>{
    const decodedpayload = jwt.sign(token,access_secret);
    return decodedpayload;
}

export const checktokenvalidity = (token)=>{
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return false;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime; 
}

// export const generaterefreshtoken = async ({userId,deviceId}) =>{
//     const token = jwt.sign({userId}, refresh_secret, { expiresIn: "7d" });
//     await redis.hset(groupkey,userId,{deviceId});
//     return token;
// }


// export const verifyrefreshtoken = async(token,deviceId)=>{
//     const decodedpayload  = jwt.sign(token,refresh_secret);
//     const key = decodedpayload.userId;
//     const redisdata = await redis.hget(groupkey,key);
//     if(!redisdata || redisdata.deviceId!=deviceId){
//         throw new Error("Unauthorised access");
//     }
//     return decodedpayload;
// }
