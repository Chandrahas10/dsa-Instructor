'use client'
import {assets} from "@/assets/assets";
import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import PromptBox from "@/components/PromptBox";
import Message from '@/components/Message';
import { useAppContext } from '@/context/AppContext';

export default function Home() {
  const [expand,setExpand] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const { selectedChat } = useAppContext();
  const messages = (selectedChat?.message || []) as Array<{ role: string; content: string; timestamp: number }>;

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand}/>
        <div className="flex-1 flex flex-col items-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image onClick={()=>(expand ? setExpand(false) : setExpand(true))}
             className="rotate-180" src={assets.menu_icon}
            alt=""/>
            {!messages.length && (
              <Image className="opacity-70" src={assets.chat_icon} alt=""/>
            )}
          </div>

          <div className="w-full max-w-5xl mt-8 mb-4 px-2 text-center">
            {messages.length ? (
              <p className="text-3xl font-semibold">{selectedChat?.name || 'New Chat'}</p>
            ) : (
              <>
                <Image src={assets.logo_icon} alt="" className="mx-auto h-16"/>
                <p className="text-3xl font-semibold mt-4">Hi, I'm Your Personal DSA Instructor</p>
                <p className="text-sm mt-2 text-white/70">{selectedChat?.name || 'New Chat'}</p>
              </>
            )}
          </div>

          <div className="w-full max-w-5xl flex-1 overflow-y-auto pb-4">
            {messages.length > 0 ? (
              <div className="space-y-3 px-2">
                {messages.map((message, index) => (
                  <Message
                    key={`${message.timestamp ?? index}-${index}`}
                    role={message.role === 'assistant' ? 'assistant' : 'user'}
                    content={message.content}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center text-white/70 gap-3">
                <p className="text-lg font-medium">{selectedChat?.name || 'New Chat'}</p>
                <p className="text-sm">Send a question to get started with this conversation.</p>
              </div>
            )}
          </div>

          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading}/>
          <p className="text-xs absolute bottom-1 text-white/50">AI-generated, for reference only</p>
        </div>
      </div>
    </div>
  );
}
