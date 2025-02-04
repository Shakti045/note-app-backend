import mongoose from "mongoose";

const UserScheema = new mongoose.Schema({
    emailid:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    notes:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Note"
        }
    ],
})

export default mongoose.model("User",UserScheema);