import Media from "../model/media.js";
import Note from "../model/note.js";
import { addNoteToElasticsearch, deleteNoteFromElastic, updateNoteFromElastic } from "../utils/elastic.js";
import { uploadfile } from "../utils/file.js";



export const createNote = async(req,res) =>{
    try {
        const {userId,title,description,type} = req.body;
        if(!userId || !title || !description){
            return res.status(404).json({
                success:false,
                message:"Invalid request"
            })
        }
        const note  = await Note.create({createdBy:userId,title:title,description:description,createdfrom:type});
        await addNoteToElasticsearch(note);
        return res.status(200).json({
            success:true,
            message:"Note created successfully",
            note
        })
    } catch (error) {
        console.log("Error while creating note  => ",error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
}

export const addimage = async (req,res)=>{
    try {
        const {noteId,userId} = req.body;
        if(!noteId){
            return res.status(404).json({
                success:false,
                message:"NoteId required"
            })
        }
        const note = await Note.findById(noteId);
        if(note.createdBy!=userId){
            return res.status(404).json({
                success:false,
                message:"Note does not belongs to you"
            })
        }
        
        const url = await uploadfile(req.files.file);
        if(!url){
            throw new Error("Url missing")
        }
        const media = await Media.create({createdby:userId,url:url,note:noteId});
        await Note.findByIdAndUpdate({_id:noteId},{$push:{images:media._id}});
        return res.status(200).json({
            success:false,
            message:"Image added successfully",
            media
        })
    } catch (error) {
        console.log("Error while image adding => ",error);
        return res.status(500).json({
            success:false,
            messsage:"Server error"
        })
    }
}

export const updateNote = async(req,res) =>{
    try {
        const {noteId,title,description,type,userId} = req.body;
        if(!noteId){
            return res.status(400).json({
                success:false,
                message:"Note Id Missing"
            })
        }
        if(!title && !description && !type){
            return res.status(400).json({
                success:false,
                message:"Invalid request"
            })
        }
        const note = await Note.findById(noteId);
        if(!note || note.createdBy!=userId){
            return res.status(400).json({
                success:false,
                message:"Invalid note Id"
            })
        }
        const updatednote  = await Note.findByIdAndUpdate(noteId,{
            title:title!=null?title:note.title,
            description:description!=null?description:note.description,
            createdfrom:type!=null?type:note.createdfrom
        },{new:true})
        await updateNoteFromElastic(noteId,updateNote.title,updateNote.description);
        return res.status(200).json({
            success:true,
            message:"Note updated",
            note:updatednote
        })
    } catch (error) {
        console.log("Error while updatin note  => ",error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
}

export const deleteNote = async(req,res) =>{
    try {
        const {userId,noteId} = req.body;
        if(!userId || !noteId){
            return res.status(404).json({
                success:false,
                message:"Invalid request"
            })
        }
        const note = await Note.findById(noteId);
        if(!note || note.createdBy!=userId){
            return res.status(400).json({
                success:false,
                message:"Invalid note Id"
            })
        }
        await Media.deleteMany({_id:{$in:note.images}});
        await Note.findByIdAndDelete(noteId);
        await deleteNoteFromElastic(noteId);
        return res.status(200).json({
            success:true,
            message:"Note deleted"
        })
    } catch (error) {
        console.log("Error while deleteing note => ",error)
        return res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
}

export const deleteimage = async(req,res)=>{
    try {
        const {userId,noteId,mediaId} = req.body;
        if(!userId || !noteId || !mediaId){
            return res.status(404).json({
                success:false,
                message:"Invalid request"
            })
        }
        const note = await Note.findByIdAndDelete(noteId);
        if(!note){
            return res.status(400).json({
                success:false,
                message:"Invalid Note Id"
            })
        }
        await Note.findByIdAndUpdate(noteId,{$pull:{images:noteId}});
        return res.status(200).json({
            success:true,
            message:"Image deleted successfully"
        })
    } catch (error) {
        console.log("Error while deleteing image => ",error)
        return res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
}

export const getallnotesofuser = async(req,res)=>{
    try {
        const {userId} = req.body;
        const notes = await Note.find({createdBy:userId}).populate({
            path:"images",
        }).sort({createdat:-1});
        return res.status(200).json({
            success:true,
            message:"Notes fetched",
            notes
        })
    } catch (error) {
        console.log("Error while getting user notes => ",error)
        return res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
}


