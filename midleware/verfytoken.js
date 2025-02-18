

import Jwt from "jsonwebtoken"

export const verfyToken = async(req,res,next)=>{
     const cookie= req.headers.cookie
       if(cookie){
           //to take the cookie which special to chat_token
    
       const chattoken= cookie.split('; ').find(str=>str.startsWith('chat_token='))
        
          if(chattoken){
             const token=chattoken.split('=')[1]
              
             
              Jwt.verify(token,process.env.SECRET_TOKEN,(err,data)=>{
                if(err) return res.status(500).json('error in token')
                   const{id,name}=data
              req.userId=id 
              req.userName=name 
              next()                
                     
             })
             
          }
       
       }
     

}