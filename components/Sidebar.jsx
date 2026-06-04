import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { assets } from '@/assets/assets';
import { useClerk, UserButton } from '@clerk/nextjs'
import { useAppContext } from '@/context/AppContext';
import ChatLabel from './ChatLabel';

const Sidebar = ({ expand, setExpand }) => {
    const { openSignIn } = useClerk();
    const { user, chats, selectedChat, setSelectedChat, createNewChat, deleteChat, renameChat } = useAppContext();
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const storedTheme = localStorage.getItem('chatboat-theme') || 'dark';
      setTheme(storedTheme);
      document.documentElement.dataset.theme = storedTheme;
    }, []);

  return (
    <div
      className={`fixed md:relative top-0 left-0 z-50 flex flex-col pt-7 transition-all h-screen overflow-hidden ${expand ? 'w-64 p-4' : 'md:w-20 w-0'} ${expand ? 'shadow-xl' : ''}`}
      style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text)' }}
    >
      {/* Upper Section: Filled with flex-1 to push the bottom container all the way down */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className={`flex ${expand ? "flex-row gap-10" : "flex-col items-center gap-8"}`}>
            <Image className={expand ? "w-36" : "w-10"} 
                src={expand ? assets.logo_text : assets.logo_icon} alt=''/>

            <div onClick={() => expand ? setExpand(false) : setExpand(true)}
            className='group relative flex items-center justify-center 
                    hover:bg-white/10 transition-all duration-300 h-9 w-9 aspect-square
                    rounded-lg cursor-pointer'>
                 <Image src={assets.menu_icon} alt='' className='md:hidden'/>
                 <Image src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} 
                        alt='' className='hidden md:block w-7'/>
                 <div className={`absolute w-max ${expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"} opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none `}>
                    {expand ? 'close sidebar' : 'open sidebar'}
                    <div className={`w-3 h-3 absolute bg-black rotate-45 ${expand ? "left-1/2 -top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"}`}></div>
                 </div>
            </div>
        </div>

        <button onClick={createNewChat} className={`mt-8 flex items-center justify-center cursor-pointer ${
            expand ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max" :
            "group relative h-9 w-9 mx-auto hover:bg-grey-500/30 rounded-lg"}`}>
            <Image className={expand ? 'w-6' : 'w-7'} src={expand ? assets.chat_icon : assets.chat_icon_dull} alt=''/>
             <div className='absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none' >
                New chat 
                <div className='w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5'></div>
             </div>
             {expand && <p className='text-white text font-medium'>New chat</p>}
        </button>

        {/* Recents Wrapper - Added min-h-0 and flex-1 to keep it correctly scroll-contained */}
        <div className={`mt-8 text-sm flex-1 flex flex-col min-h-0 ${expand ? "block" : "hidden"}`}>
            <p className='my-1' style={{ color: 'var(--text-secondary)' }}>Recents</p>
            <div className='overflow-y-auto pr-1 recents-scrollbar flex-1 pb-4'>
              <ChatLabel
                chats={chats}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                deleteChat={deleteChat}
                renameChat={renameChat}
              />
            </div>
        </div>
      </div>

      
      <div className="pt-4 mt-auto border-t border-white/5 bg-[var(--bg-sidebar)]">
       
        <div onClick={user ? null : openSignIn}
         className={`flex items-center ${expand ? "rounded-lg" : "justify-center w-full"} gap-3 text-sm p-2 mt-2 mb-2 cursor-pointer`} style={{ color: 'var(--text-secondary)' }}>
            {user ? <UserButton/> : <Image src={assets.profile_icon} alt='' className='w-7'/>}
            {expand && <span>My Profile</span>}
        </div>
      </div>

    </div>
  )
}

export default Sidebar;