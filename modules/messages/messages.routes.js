import { Router } from "express";
import { getMessage } from "./messages.controller.js";
import { verfyToken } from "../../midleware/verfytoken.js";
 


const messageRoute= Router()

 messageRoute.get('/:selectUser',verfyToken,getMessage)
 
 




export default messageRoute