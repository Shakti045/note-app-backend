import mongoose from "mongoose";

const MediaScheema = new mongoose.Schema({
    createdby:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    note:{
        type:mongoose.Schema.ObjectId,
        ref:"Note"
    },
    url:{
        type:String,
        required:true
    }
})


export default mongoose.model("Media",MediaScheema);