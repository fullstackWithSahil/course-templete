"use client"
import { useContext } from 'react'
import Messagebubble from './Messagebubble'
import { SocketContext } from '../Socketprovider'

export default function Box() {
    const socket = useContext(SocketContext);
    if(!socket){
        console.log("NO socket")
        return;
    }
  return (
    <Messagebubble socket={socket}/>
  )
}
