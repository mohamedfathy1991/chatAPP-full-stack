
import React, { useContext } from 'react'
import { Usercontext } from './context/usercontext'

export default function Home() {
    const user=useContext(Usercontext)
    console.log(user);
    
  return (
     <>home</>
  )
}
