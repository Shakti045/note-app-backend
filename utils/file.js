import cloudinary from '../connections/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';


export const uploadfile = async (file) =>{
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
        public_id: `myuploads/${uuidv4()}`, 
        folder: 'myfolder', 
        resource_type: 'auto',
      });
    return result.secure_url;
}