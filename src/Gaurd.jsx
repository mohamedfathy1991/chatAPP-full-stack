
import React, { useContext, useEffect } from 'react'
import { Usercontext } from './context/usercontext'
import { Navigate } from 'react-router-dom'

export default function Gaurd(props) {

console.log("gaurd");

const {id}= useContext(Usercontext)
if(id ==null){
    return <Navigate to={'/register'} /> 
 
 }else{
     return (
         <>
         {props.children}
         </>
       )
 }

   

     
       


  
}
