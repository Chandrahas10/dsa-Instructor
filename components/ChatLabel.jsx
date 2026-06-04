import React, { useState } from 'react'
import Image from "next/image";
import { assets } from '@/assets/assets';
const ChatLabel = ({ chats = [], selectedChat, setSelectedChat, deleteChat, renameChat }) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editName, setEditName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);

  if (!chats.length) {
    return (
      <div className='text-sm text-white/50'>No chats yet. Start a new conversation.</div>
    );
  }

  const startEdit = (chat) => {
    setEditingChatId(chat._id);
    setEditName(chat.name || '');
    setMenuOpenId(null);
  };

  const cancelEdit = () => {
    setEditingChatId(null);
    setEditName('');
  };

  const saveEdit = async (chatId) => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    const success = await renameChat(chatId, trimmed);
    if (success) {
      setEditingChatId(null);
      setEditName('');
    }
  };

  const toggleMenu = (chatId) => {
    setMenuOpenId((prev) => (prev === chatId ? null : chatId));
  };

  return (
    <div className='space-y-2'>
      {chats.map((chat) => {
        const isActive = selectedChat?._id === chat._id;
        const isEditing = editingChatId === chat._id;
        return (
          <div key={chat._id} className={`border border-white/10 rounded-xl transition-all ${isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
            <div className='flex items-center justify-between'>
              <button
                type='button'
                onClick={() => setSelectedChat(chat)}
                className='w-full text-left p-3 flex items-center gap-2'
              >
                {isEditing ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className='w-full bg-transparent text-white outline-none placeholder:text-white/40'
                    placeholder='Chat name'
                  />
                ) : (
                  <span className='truncate'>{chat.name || 'Untitled Chat'}</span>
                )}
              </button>
              <div className='flex items-center gap-1 pr-2'>
                {isEditing ? (
                  <>
                    <button
                      type='button'
                      onClick={() => saveEdit(chat._id)}
                      className='text-xs text-white/90 bg-primary/90 px-2 py-1 rounded-lg hover:bg-primary'
                    >
                      Save
                    </button>
                    <button
                      type='button'
                      onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                      className='text-xs text-white/70 px-2 py-1 rounded-lg hover:bg-white/10'
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className='relative'>
                      <button
                        type='button'
                        onClick={(e) => { e.stopPropagation(); toggleMenu(chat._id); }}
                        className='p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg'
                      >
                        <Image src={assets.three_dots} alt='More actions' className='w-4 h-4' />
                      </button>
                      {menuOpenId === chat._id && (
                        <div className='absolute right-0 top-full mt-2 w-36 rounded-2xl border border-white/10 bg-[#15181d] shadow-lg z-20'>
                          <button
                            type='button'
                            onClick={(e) => { e.stopPropagation(); startEdit(chat); }}
                            className='w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/5'
                          >
                            Rename
                          </button>
                          <button
                            type='button'
                            onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); deleteChat(chat._id); }}
                            className='w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/5'
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatLabel;
