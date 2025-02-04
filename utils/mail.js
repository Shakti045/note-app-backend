import transporter from "../connections/mail.js";

async function sendemail(receiver,subject,message){
    try{
         await  transporter.sendMail({
         from:"Note Taking App",
         to:`${receiver}`,
         subject:`${subject}`,
         html:`${message}` 
     })
 
    }catch(err){
     console.log("Error while sending mail in utils","=>",err);
    }
 }

 export default sendemail;