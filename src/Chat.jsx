import React, { useEffect, useRef, useState } from "react";
import { Avatarcom } from "./Avatar";
import Log from "./Log";
import { useContext } from "react";
import { Usercontext } from "./context/usercontext";
import axios from "axios";
import Offline from "./Offline";
import OfflinePeople from "./Offline";
import { useNavigate } from "react-router-dom";

export default function Chats() {
  const [onlinepoeple, setonlinepeople] = useState({});
  const [selecteduser, setselecteduser] = useState();
  const { id, user,setid,setuser } = useContext(Usercontext);
  const [message, setmessage] = useState();
  const [allmessages, setallmessages] = useState([]);
  const[oflinepeople,setoflinepeople]=useState([])
  const navigate= useNavigate()
 
  const [ws, setws] = useState();
  const messagesEndRef = useRef();
  const scrollToBottom = () => {
    //to make scroll for message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (selecteduser) {
       
      axios.get(`/messages/${selecteduser}`)
        .then(res => {
         const {data}=res         
          setallmessages(data.messages) 
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selecteduser]);

  useEffect(() => {
    scrollToBottom();
  }, [allmessages]);

  useEffect(() => {
    connectToSocket()
     
  }, []);

  function connectToSocket(){
    const ws = new WebSocket("ws://localhost:3000");
    setws(ws);
    ws.addEventListener("message",handleMessage )
    ws.addEventListener('close',()=>{
      console.log('socket closed try to connect')
      connectToSocket()
    })

  }
  const handleMessage=   (ev) => {
    const messagedata = JSON.parse(ev.data);
     
    function showOnlinePeope(onlinearray) {
      const people = {};
      onlinearray.forEach((person) => {
        people[person.id] = person.name;
      });

      setonlinepeople(people);
    }

    if ("online" in messagedata) {
       
      showOnlinePeope(messagedata.online);
    } else {
       setallmessages((prev) => [...prev, { ...messagedata }]);
    }
  }
     
  const peopleExcutemainuser = { ...onlinepoeple };
  delete peopleExcutemainuser[id];
  function sendMessage(ev,file) {
    if(ev)ev.preventDefault();
    setmessage("");
    setallmessages((prev) => [
      ...prev,
      { text: message, sender: id, recpint: selecteduser },
    ]);
    ws.send(
      JSON.stringify({
        message: {
          recpint: selecteduser,
          text: message,
          file,
          _id: Date.now(),
        },
      })
    );
    if(file){
      axios.get(`/messages/${selecteduser}`)
        .then(res => {
         const {data}=res         
          setallmessages(data.messages) 
        })
    }
  }
  function  sendFiles(ev){
    const readfile= new  FileReader()  
    readfile.readAsDataURL(ev.target.files[0])
     readfile.onload= ()=>{
       
     sendMessage(null,{
       data:readfile.result,
       info:ev.target.files[0].name
 
     })
      
     
     
   }
  }
   
 
 
  

  function  logout(){
    axios.post('/logout').then(res=>{
      console.log(res.data)
      setws(null)
    
     localStorage.clear()
    navigate('/register')


    })
    
  }
  useEffect(()=>{
    axios.get('/user/allpeople').then(res=>{
      const allonlieandoflineWithoutUser=(res.data.message).filter(person=>person._id !=id)
      const oflineOnly = allonlieandoflineWithoutUser.filter(user => !(user._id in onlinepoeple));
     setoflinepeople(oflineOnly)
      
      
    }).catch(err=>{
      console.log(err);
      
    })

  },[onlinepoeple])

function downloadfile(filename){
  
  console.log("download");
  
  axios.get(`/download/${filename}`)
  .then(res=>{
    console.log(res);
    
  })
  .catch(err=>{
    console.log(err)
  })
}
  
  return (
<div className="bg-slate-500 h-screen flex">
  {/* Left-hand side (Fixed Sidebar) */}
  <div className="flex-1 flex flex-col overflow-hidden">
    <div className="bg-green-300 flex flex-col justify-between h-full">
      {/* Top Section: Log and Users */}
      <div>
        <Log />
        {Object.keys(peopleExcutemainuser).map((id) => (
          <div
            onClick={() => setselecteduser(id)}
            key={id}
            className={
              "cursor-pointer p-2 mb-1 border-separate gap-2 flex align-middle justify-start " +
              (selecteduser == id ? "bg-teal-500 " : "")
            }
          >
            <Avatarcom online={true} peopleonline={onlinepoeple[id]} userid={id} />
            <span className="self-center font-bold">{onlinepoeple[id]}</span>
          </div>
        ))}

        <OfflinePeople oflinepeople={oflinepeople} selecteduser={selecteduser} setselecteduser={setselecteduser} />
      </div>

      {/* Bottom Section: Log Out Button */}
      <div className="p-4">
        <button 
        onClick={() => { logout()}}
          className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  </div>

  {/* Right-hand side (Scrollable Chat) */}
  <div className="bg-blue-300 flex-[4] flex flex-col h-screen overflow-y-auto custom-scrollbar">
    <div id="message" className="flex-1 flex flex-col pb-10">
      {selecteduser ? (
        <>
          <h1 className="text-center text-2xl">{onlinepoeple[selecteduser]}</h1>
          {allmessages.map((message, id) => (
            <div key={id} className={message.sender == selecteduser ? "flex flex-row-reverse px-4 mb-2" : ""}>
              <p className={message.sender == selecteduser ? "bg-gray-400 p-1 text-lg w-fit text-right rounded-lg" : "bg-gray-500 text-lg w-fit rounded-lg p-1 mb-2"}>
                {message.text}
                {message.file&&(
                  <a   target="_blank"  href={`http://localhost:3000/uploads/${message.file}`}   className="text-blue-500 underline hover:text-blue-700"
                  onClick={()=>{
                   
                    downloadfile(message.file)
                  }}>
                    {message.file}
                  </a>
                )}
              </p> 
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      ) : (
        <div className="bg-gray-200 h-full text-2xl text-gray-400">
          &larr; Select a person from the sidebar
        </div>
      )}
    </div>

    {/* Form for sending messages (Sticky) */}
    {selecteduser && (
      <div className="p-2 bg-white border-t sticky bottom-0">
        <form onSubmit={sendMessage} className="flex gap-2">
       <label  htmlFor="attach" className="border cursor-pointer hover:text-green-700" >
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
</svg>
       </label>
<input type="file"  onChange={(e)=>sendFiles(e)} className="hidden"  id="attach"/>

          <input value={message} onChange={(e) => setmessage(e.target.value)} className="p-2 rounded-md flex-1 border border-gray-300" type="text" placeholder="Enter message" />
          <button className="bg-red-300 p-2 rounded-md hover:bg-red-400" type="submit">
            <svg  width="1.5em" height="1.5em" fill="currentColor" viewBox="0 0 512 512">
              <path d="m476.59 227.05-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52 24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4 24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8z" />
            </svg>
          </button>
        </form>
      </div>
    )}
  </div>
</div>





  );
}
