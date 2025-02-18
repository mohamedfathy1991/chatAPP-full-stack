import 'dotenv/config';
import express from 'express';
import userRoute from './modules/user/user.routes.js';
import ws, { WebSocketServer } from 'ws';
import "./database/conection.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import Jwt from "jsonwebtoken"
import { MessageModel } from './database/models/message.models.js';
import messageRoute from './modules/messages/messages.routes.js';
import path from 'path'

 import fs from 'fs'
import { log } from 'console';
const app = express();
app.use(cookieParser());

const port = 3000;
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true  // To read cookies from frontend
}));

app.use(express.json());
app.use('/uploads',express.static('uploads'))
app.use('/user', userRoute);
app.use('/messages', messageRoute);
app.use('/logout',(req,res,next)=>{
  res.cookie("chat_token", '').json('ok')
})

app.get('/', (req, res) => res.send('Hello World!'));

// Start the HTTP server
const server = app.listen(process.env.PORT || port  )

// Initialize WebSocket server
 
const wss = new WebSocketServer({
  server  // Pass the HTTP server to WebSocket server
});

wss.on('connection', (connection,req) => {  
  
  connection.isAlive=true
  connection.timer=setInterval(()=>{
     connection.ping()
    connection.death = setTimeout(()=>{
      connection.isAlive=false
            console.log("conection is death");
            clearInterval(connection.timer)
      connection.terminate()
              notefyonline()// to if some one disconect resend new online
              console.log("conection is death");

     },1000)
  },5000)
  connection.on('pong',()=>{
        clearTimeout(connection.death)
    console.log('pong')
  }
  )
   const cookie= req.headers.cookie
   
   if(cookie){
       //to take the cookie which special to chat_token

   const chattoken= cookie.split('; ').find(str=>str.startsWith('chat_token='))
    
      if(chattoken){
         const token=chattoken.split('=')[1]
          
          Jwt.verify(token,process.env.SECRET_TOKEN,(err,data)=>{
            if(err) return  connection.send("errr") 
               const{id,name}=data
                connection.id=id
               connection.name=name 
                
            connection.send([data])      
                
         })
         
      }
   
   }
 
   
   console.log('A new client connected');
 
    
   
// notefy online people
 function notefyonline(){
   
  [...wss.clients].forEach(client=>{
      
    
   client.send(JSON.stringify( {online:[...wss.clients]
    .map(user=>({name:user.name,id:user.id}))}))//send to all client allclient which connected
 })
 }
//  recive message and send to db and send to anoher user
 connection.on('message',async(messages)=>{
  
  
  
  
  const {message}= JSON.parse( messages.toString())
 
  let fileattach= null
  if(message.file){
     const filename= message.file.info 
     const partfile= filename.split('.')
     const fileext= partfile[partfile.length-1]
     const filenameWithEtenstion= Date.now() + '_' + partfile[0]+'.' +fileext
     const paths= path.resolve('uploads',filenameWithEtenstion)
 

    const matchdata=(message.file.data).split('base64,')
    const filedata=matchdata[1]
    const fileBuffer = Buffer.from(filedata, 'base64');
    fs.writeFileSync(paths,fileBuffer,()=>{
      console.log('file uploaded')
    })

     fileattach= filenameWithEtenstion
    
 
  }
  
   console.log(message);
   
  
   if((message.text||message.file) && message.recpint){
   console.log(fileattach);
    
    let dbmessage= await MessageModel.create({
      text:message.text,
      sender:connection.id,
      recpint: message.recpint,
      file:fileattach
 
    });
    
  
    [...wss.clients].filter(x=>x.id==message.recpint).forEach(x=>{//use for here to send message to all browser or mobile if user open in another browser
      x.send(JSON.stringify({text:message.text,selecteduser:message.recpint,
        file:fileattach,
        sender:connection.id ,_id:dbmessage._id}))//send 
    })
     
     
  }

  
 })
 notefyonline()

 
})

wss.on('close',(data)=>{
  console.log('Client disconnected')
  console.log(data);
  
})



// download file 

app.get('/download/:filename', (req, res) => {
  console.log('download');

  
  const filename = req.params.filename;
  console.log("omar download");
  
  const filePath = path.resolve('uploads',filename)
  
  console.log(filePath);
  console.log(filename);
  
  
  res.download(filePath, filename, (err) => {

    if (err) {
      console.log(err);
      return res.status(500).send('Error downloading file')
      }
      });
 })