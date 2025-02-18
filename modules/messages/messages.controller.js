import mongoose from "mongoose";
import { MessageModel } from "../../database/models/message.models.js";



export const getMessage=async(req,res,next)=>{
    const userid= (req.userId)
    const {selectUser}=req.params;
     

     
     try{
        const messages = await MessageModel.find( {  
            
            
             
                 sender:{$in:[userid,selectUser]} ,
                 recpint:{$in:[userid,selectUser]} ,
            
        }
            
          )
            
       
    res.status(200).json({
            messages: messages
          })

    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal Server Error",
        })
    }   
}
