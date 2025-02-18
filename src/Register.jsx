
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Usercontext } from './context/usercontext'
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const [username,setusername]=useState('')
    const [password,setpassword]=useState('')
    const[err,seterr]=useState(null)
    const[loginOrRegitser,setloginOrRegitser ]=useState('register')
    const navigate=useNavigate()


      let {setuser,user,id,setid}   = useContext(Usercontext)
    const handleSubmitRegiste=async(e)=>{
        e.preventDefault()
        const values={username,password}
        
     try{
      
      let {data}= await axios.post(`/user/${loginOrRegitser}`,values)
      console.log(data)
       setuser(username)
       setid(data.id)
        
       navigate('/chat')

     }catch(err){
      console.log(err)
      seterr(err.response.data.err)
    }
       
    }
     

  return (
    <div className='bg-blue-300  h-screen flex items-center justify-center'>
      
         
         <form onSubmit={
            handleSubmitRegiste } className='w-1/4  '>
              <h2>{err}</h2>
            <input 
            onChange={(e)=>setusername(e.target.value)}
            value={username}
            type='text' placeholder='enter name' className='w-full p-2 rounded-xl mb-2  ' />
            <input
            onChange={(e)=>setpassword(e.target.value)}
            value={password}
            type='password' placeholder='enter password' className='w-full p-2 rounded-xl mb-2  ' />
           <button type='submit' placeholder='enter name'
            className='w-full p-2 text-white rounded-xl mb-2 bg-blue-900 '>
             {loginOrRegitser=="register"?"register":"login"}
             </button>
             {loginOrRegitser=="register"?
             <h3 className='text-center'> i have already acount <button
             className='font-bold'
             onClick={(e) => {
              e.preventDefault(); // منع التوجيه الافتراضي
              setloginOrRegitser('login');
            }}> login</button> </h3> 
:<h3 className='text-center'> i dont have acount   <button
className=' font-bold '
onClick={(e) => {
 e.preventDefault(); // منع التوجيه الافتراضي
 setloginOrRegitser('register');
}}> register</button> </h3> 
}

      </form> 


        </div>
   
     
  )
}
