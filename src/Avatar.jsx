

import { Avatar } from 'flowbite-react';
import React from 'react'

const colurs= ["bg-blue-600","bg-blue-200" ,"bg-orange-300",
    "bg-green-300","bg-green-200","bg-blue-400" 
    ,"bg-orange-300","bg-green-300"]
 

export function Avatarcom({peopleonline,userid ,online}) {
    const user= parseInt(userid,10)

    const coloruser=user%colurs.length;
    
  return (
    <div className={` rounded-full relative  w-10 h-10    cursor-pointer  flex justify-center  items-center ${colurs[coloruser]}` }>
        <span>{peopleonline?.slice(0,1)}</span>
        {online?
        
        <span className="w-3 h-3 absolute rounded-full bg-green-500 bottom-0 right-0"></span>

        :        <span className="w-3 h-3 absolute rounded-full bg-gray-400 bottom-0 right-0"></span>
}

      </div>
  );
}
