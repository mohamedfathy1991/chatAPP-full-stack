
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
 
export const Usercontext = createContext();

export default function UsercontextProvider(props) {
  const [user, setuser] = useState(localStorage.getItem("user") || null);
  const [id, setid] = useState(localStorage.getItem("id") || null);



  // very importtant?!!!!!!?
 
 
  
  useEffect(()=>{
     
    axios.get('/user/profile').then(data=>{
 
        setid(data.data.data.id)
        setuser(data.data.data.name)
        localStorage.setItem("user", data.data.data.name);
        localStorage.setItem("id", data.data.data.id);

        
         
        
    }).catch(err=>{
      console.log(err);
      // Navigates('/register')
 
       
     
      
    })
},[id])

 
  return (
    <Usercontext.Provider value={{ user, setuser, id, setid }}>
      {props.children}
    </Usercontext.Provider>
  );
}
