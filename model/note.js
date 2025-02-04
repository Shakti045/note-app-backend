import mongoose from "mongoose";

const NoteScheema = new mongoose.Schema({
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    createdat:{
        type:Number,
        default:Date.now()
    },
    createdfrom:{
        type:String,
        enum:['Text','Audio'],
        required:true
    },
    images:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Media",
        }
    ]
})


export default mongoose.model("Note",NoteScheema);