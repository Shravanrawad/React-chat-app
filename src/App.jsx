import React, { useEffect, useState } from "react"
import List from "./componants/list/list"
import Chats from "./componants/chats/chats"
import Profiled from "./componants/profiledetails/profiled"
import Login from "./componants/login/login"
import Notification from "./componants/notification/notification"
import { onAuthStateChanged } from "firebase/auth"
import { getAuth } from "firebase/auth"
import { app } from "./componants/store/firebase"
import { useUserStore } from "./componants/store/userstore"
import { useChatStore } from "./componants/store/chatstore"

function App() {

  // const [user, setuser] = useState(false)
  const {currentUser, isloading, fetchUserInfo} = useUserStore()
  const {chatId} = useChatStore()

  useEffect(() => {
     const auth = getAuth(app)
     const unsub = onAuthStateChanged(auth,(user)=> {
       fetchUserInfo(user?.uid)
     })

     return () => {
      unsub()
     }
  },[fetchUserInfo])


  if(isloading) return <div className="loading">Loading</div>

  const updateuser = (value) => {
    setuser(value)
  }

  return (
    <div className="container">
    {
      currentUser ? (
        <>
        <List/>
        {chatId && <Chats/>}
        {chatId && <Profiled/>}
        </>
      ) : (<Login/>)
    }    
    <Notification/>
    </div>
  )
}

export default App
