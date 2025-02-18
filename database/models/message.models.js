import mongoose, { model, Schema } from "mongoose"




const messageSchema= new  Schema({
  
         sender:{
            type:mongoose.Schema.ObjectId,
            ref:"User"
         },
         recpint:{
            type:mongoose.Schema.ObjectId,
            ref:"User"

         }
         ,
         text:String,
         file:String
         
     
     

},{
    timestamps:true
})


export const MessageModel=   model('Message',messageSchema)
