import Note from "../model/note.js";
import { searchNotesByUserAndText } from "../utils/elastic.js";

export const searchnotes = async (req,res)=>{
    try {
        const {userId} = req.body;
        const {text} = req.query;
        if(!userId || !text){
            return res.staus(400).json({
                success:false,
                message:"Invalid Request"
            })
        }
        const notes = await searchNotesByUserAndText(userId,text);
        return res.status(200).json({
            success:true,
            message:"Notes fetched",
            notes
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Sever error"
        })
    }
}

export const getnotebyid = async(req,res)=>{
   try {
    const {userId} = req.body;
    const {noteId} = req.params;
    if(!userId || !noteId){
        return res.staus(404).json({
            success:false,
            message:"Invalid Request"
        })
    }
    const note = await Note.findById(noteId).populate({
        path:"images"
    })
    if(note.createdBy!=userId){
        return res.staus(400).json({
            success:false,
            message:"Invalid noteid"
        })
    }
    return res.staus(200).json({
        success:true,
        message:"note fetched",
        note
    })
   } catch (error) {
      return res.staus(500).json({
        success:false,
        message:"Sever error"
     })
   }
}