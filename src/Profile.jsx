import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { Usercontext } from './context/usercontext';

export default function Profile() {

   
  const {id}=useContext(Usercontext)
  console.log(id);
  
  
    useEffect(()=>{
      
    },[])
     
  return (
    <div>
      my profile logein  
    </div>
  )
}
