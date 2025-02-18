import { Router } from "express";
import { getPeople, getProfile, logIn, registerUser } from "./user.controller.js";



const userRoute= Router()

userRoute.post('/register',registerUser)
userRoute.get('/profile',getProfile)
userRoute.get('/allpeople',getPeople)
userRoute.post('/login',logIn)

 




export default userRoute