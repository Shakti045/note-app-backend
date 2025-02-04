import express from 'express';
import cookieParser from 'cookie-parser';
import { configDotenv } from "dotenv";
import { connectdb } from './connections/db.js';
import router from './routes/route.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import createNotesIndex from './utils/elastic.js';


configDotenv();

const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))
app.use(cors({
    origin:process.env.CLINET_BASE_URL,
    credentials:true
}))
app.use("/api/v1/",router);

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Server is running on port :: ${PORT}`)
});

app.get("/health",(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Server is Ok"
    })
})

connectdb();
createNotesIndex();