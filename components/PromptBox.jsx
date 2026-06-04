import {assets} from "@/assets/assets";
import React, { useState } from 'react'
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";


const PromptBox = ({setIsLoading,isLoading}) => {

const [prompt, setPrompt]=useState('');
const {user,chats , setChats,selectedChat,setSelectedChat} =useAppContext();

const handleKeyDown =(e)=>{
    if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        sendPrompt(e);
    }
}

const sendPrompt =async(e)=>{
    const promptCopy =prompt;

    try{
        e.preventDefault();
        if(!user) return toast.error('Login to send message');
        if(!selectedChat) return toast.error('Select a chat before sending a message');
        if(isLoading) return toast.error('Wait for the previous prompt response');
        
        setIsLoading(true);
        setPrompt("")

        const userPrompt ={
            role:"user",
            content:prompt,
            timestamp:Date.now(),
        }

        const shouldRenameChat = !selectedChat?.message?.length || selectedChat?.name === 'New Chat';
        const chatName = shouldRenameChat ? prompt.trim().slice(0, 40) : selectedChat?.name;

        if (shouldRenameChat && chatName) {
            await axios.post('/api/Chat/rename', {
                chatId: selectedChat._id,
                name: chatName
            });
        }

        setChats((prevChats)=>prevChats.map((chat)=>chat._id === selectedChat._id ? 
         {
             ...chat,
             name: chatName || chat.name,
             message:[...(chat.message || []), userPrompt]
         }:chat
        ))

        setSelectedChat((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                name: chatName || prev.name,
                message: [...(prev.message || []), userPrompt],
            };
        });

        const {data} = await axios.post('/api/Chat/ai',{
            chatId:selectedChat._id,
            prompt
        })

        if(data.success){
            setChats((prevChats)=> prevChats.map((chat)=>chat._id === selectedChat._id 
                ? {...chat, message:[...(chat.message || []), data.data]} :chat))

            const messageText = data.data.content || '';
            const messageTokens = messageText.split(" ");
            let assistantMessage ={
                role:'assistant',
                content:"",
                timestamp:Date.now(),
            }
            setSelectedChat((prev)=>(prev ? {
                ...prev,
                message:[...(prev.message || []), assistantMessage],
            } : prev))

            for(let i=0;i<messageTokens.length;i++){
                setTimeout(()=>{
                    assistantMessage.content = messageTokens.slice(0 ,i+1).join(" ");
                    setSelectedChat((prev)=>{
                        if(!prev) return prev;
                        const updatedMessages = [
                            ...prev.message.slice(0,-1),
                            assistantMessage
                        ]
                        return {...prev, message: updatedMessages};
                    })
                },i*100)

            }

            }else{
                toast.error(error.message);
                setPrompt(promptCopy);
            } 

            }
            catch(error){
                toast.error(error.message);
                setPrompt(promptCopy);
            }
            finally{
                setIsLoading(false);
            }
        
    
}

  return (
    <form onSubmit={sendPrompt}
    className={`w-full ${false ? "max-w-3xl": "max-w-2xl"}
        bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
            <textarea 
            onKeyDown={handleKeyDown}
            className='outline-none w-full resize-none overflow-hidden
            wrap-break-word bg-transparent'
            rows={2}
            onChange={(e)=>setPrompt(e.target.value)} value={prompt}
            placeholder='Message AlgoMaster' required/>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <p className="flex items-center gap-2 text-xs border border-grey-300/40
                     px-2 py-1 rounded-full cursor-pointer hover:bg-grey-500/20 transition">
                        {/* <Image className="h-5" src={assets.deepthink_icon} alt=""/> */}
                        <Image className="h-5" src={assets.deepthink_icon}   width={20} height={20} alt=""/>
                        AlgoMaster(R1)
                    </p>
                    <p className="flex items-center gap-2 text-xs border border-grey-300/40
                     px-2 py-1 rounded-full cursor-pointer hover:bg-grey-500/20 transition">
                        <Image className="h-5" src={assets.search_icon} alt=""/>
                        search
                    </p>
                </div>

                <div className="flex items-center gap-2">
                     <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt=""/>
                     <button className={` ${prompt ? "bg-primary" : "bg-[#71717a]"}
                      rounded-full p-2 cursor-pointer`}>
                       <Image className="w-3.5 aspect-square"
                        src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt=""/>
                     </button>
                </div>
            </div>
    </form>
  )
}

export default PromptBox;
