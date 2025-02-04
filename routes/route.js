import {Router} from 'express'
import { checktoken, getotp, login, logout, signup } from '../controlers/auth.js';
import { addimage, createNote, deleteNote, getallnotesofuser, updateNote } from '../controlers/note.js';
import { authenticate } from '../middleware/auth.js';
import { getnotebyid, searchnotes } from '../controlers/notesearch.js';

const router = Router();


router.post("/getotp",getotp);
router.post("/signup",signup);
router.post("/login",login);
router.get("/checktoken",checktoken);
router.get("/logout",logout);


router.post("/createnote",authenticate,createNote);
router.get("/allnotes",authenticate,getallnotesofuser);
router.post("/addimage",authenticate,addimage);
router.post("/updateNote",authenticate,updateNote);
router.delete("/deleteNote",authenticate,deleteNote);
router.get("/searchnotes",authenticate,searchnotes);
router.get("/getnotebyid:noteId",authenticate,getnotebyid);


export default router;