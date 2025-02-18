import Jwt from "jsonwebtoken";
import { UserModel } from "../../database/models/user.model.js";

import bcrypt from "bcrypt";
export const registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = new UserModel({
      username,
      password: hashedPassword,
    });

    await user.save();
    Jwt.sign({ id: user._id ,name:user.username}, process.env.SECRET_TOKEN, (err, token) => {
      if (err) {
        console.log(err);
        return res.status(400).json( "error in jwt" );
      }

      res
        .cookie("chat_token", token)
        .status(201)
        .json({ message: "User created successfully", id: user._id ,name:user.username});
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({err:"error in save in db "});
  }
};

export const logIn=async(req,res,next)=>{
  try{
    console.log("sss");
    
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if(!user)   throw("usernot found")
     
    let ismatch= bcrypt.compareSync(password,user.password)
    if(!ismatch) throw  ( "password not match")
        Jwt.sign({ id: user._id ,name:user.username}, process.env.SECRET_TOKEN)


    Jwt.sign({ id: user._id ,name:user.username}, process.env.SECRET_TOKEN, (err, token) => {
        if (err) {
          console.log(err);
           throw ({ message: "error in jwt" });
        }
  
        res
          .cookie("chat_token", token)
          .status(200)
          .json({ message: "User login successfully", id: user._id ,name:user.username});
      });
  }catch(err){
    console.log(err);
    res.status(500).json( {err});

  }
    
}

export const getProfile =async(req,res)=>{
const{chat_token}=req.cookies

Jwt.verify(chat_token, process.env.SECRET_TOKEN,((err,data)=>{
 if(err){
    return res.status(403).json({message:"invalid token"})
 }
 res.json({message:"success",data})
}))

}
export const getPeople =async(req,res)=>{
  
  const data= await UserModel.find({},{_id:1,username:1})
  res.json({
    message:data
  })
   
  
  }