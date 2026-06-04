"use client";
import { useAuth,useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NextResponse } from "next/server";
export const AppContext =createContext();

export const useAppContext =()=>{
    return useContext(AppContext)
}

export const AppContextProvider =({children})=>{
    const {user} =useUser();
    const {getToken}=useAuth();

    const [chats,setChats]=useState([]);
    const [selectedChat,setSelectedChat]=useState(null);

    const createNewChat=async ()=>{
        try{
            if(!user) return null;

            const token =await getToken();
            await axios.post('/api/Chat/create',{},{headers:{
                Authorization:`Bearer ${token}`
            }})

            fetchUsersChats();
        }catch(error){
            toast.error(error.message)
        }
    }

    const deleteChat = async(chatId) => {
        try {
            if(!user) return null;
            const token = await getToken();
            const {data} = await axios.post('/api/Chat/delete', { chatId }, { headers: {
                Authorization: `Bearer ${token}`
            }});
            if (data.success) {
                let remainingCount = 0;
                setChats((prevChats) => {
                    const remaining = prevChats.filter((chat) => chat._id !== chatId);
                    remainingCount = remaining.length;
                    if (selectedChat?._id === chatId) {
                        setSelectedChat(remaining[0] || null);
                    }
                    return remaining;
                });
                if (selectedChat?._id === chatId && remainingCount === 0) {
                    await createNewChat();
                }
                toast.success('Chat deleted');
            } else {
                toast.error(data.message || 'Unable to delete chat');
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const renameChat = async(chatId, name) => {
        try {
            if(!user) return null;
            if (!name?.trim()) {
                toast.error('Chat name cannot be empty');
                return false;
            }

            const token = await getToken();
            const {data} = await axios.post('/api/Chat/rename', { chatId, name: name.trim() }, { headers: {
                Authorization: `Bearer ${token}`
            }});
            if (data.success) {
                setChats((prevChats) => prevChats.map((chat) => chat._id === chatId ? { ...chat, name: name.trim() } : chat));
                if (selectedChat?._id === chatId) {
                    setSelectedChat((prev) => prev ? { ...prev, name: name.trim() } : prev);
                }
                toast.success('Chat renamed');
                return true;
            }
            toast.error(data.message || 'Unable to rename chat');
            return false;
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    }

    const fetchUsersChats =async()=>{
        try{
             const token =await getToken();

             const {data} =await axios.get('/api/Chat/get',{headers:{
                Authorization:`Bearer ${token}`
            }})
            if(data.success){
                console.log(data.data);
                setChats(data.data);

                // If the user have no chat create the new chat 
                if(data.data.length ===0){
                    await createNewChat();
                    return fetchUsersChats();
                }
                else{
                    //  sorts the chats by updated dates
                    data.data.sort( (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    // set recently updated chat as selected chat
                    setSelectedChat(data.data[0]);
                    console.log(data.data[0])
                }
            }
            else {
                toast.error(data.message)
            }
            }
        catch(error){
             toast.error(error.message)
        }
    }

useEffect(()=>{
    if(user){
        fetchUsersChats();
    }
},[user])
    const value ={
        user,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchUsersChats,
        createNewChat,
        deleteChat,
        renameChat
    }
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
