import React, { useContext } from 'react'
import { Avatarcom } from './Avatar';
import { Usercontext } from './context/usercontext';

export default function OfflinePeople({oflinepeople,selecteduser,setselecteduser}) {
      const { id } = useContext(Usercontext);
       
    

return(
    <>
      {oflinepeople.map((user) => {
     
     return (
       

       <div
       className= {" cursor-pointer p-2 mb-1 border-separate gap-2 flex align-middle justify-start " 
 +
       (selecteduser == user._id ? "bg-teal-500 " : "")}
      
       onClick={() => setselecteduser(user._id)}
       
        
       >
    

         <Avatarcom online={false} peopleonline={user.username} userid={id} />
         <span className="self-center font-bold  ">{user.username}
           
         </span>
       </div>
       
     );
   })}
    </>
)
}
