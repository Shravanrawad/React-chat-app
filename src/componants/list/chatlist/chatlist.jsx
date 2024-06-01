import React, { useEffect, useState } from 'react'
import './chatlist.css'
import searchimg from '../../../../assets/search.png'
import plusimg from '../../../../assets/plus.png'
import minusimg from '../../../../assets/minus.png'
import avatarimg from '../../../../assets/avatar.png'
import Adduser from '../../adduser/adduser'
import { useUserStore } from '../../store/userstore'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../store/firebase'
import { useChatStore } from '../../store/chatstore'

function Chatlist() {

  const [addmode,setaddmode] = useState(false)
  const [chats,setchats] = useState([])
  const [input, setinput] = useState('')

  const {currentUser} = useUserStore()
  const {chatId, changechat} = useChatStore()

  useEffect(() => {
     const unsub = onSnapshot(doc(db, 'userchats', currentUser.id), async (res) => {
           const items = res.data().chats

           const promises = items.map( async (item) => {
               const userDocRef = doc(db, 'users', item.receiverId)
               const userDocSnap  = await getDoc(userDocRef)

               const user = userDocSnap.data()
               return {...item, user}
              })

              
              Promise.all(promises)
              .then((chatData) => {
                setchats(chatData.sort((a,b) => b.updatedAt - a.updatedAt))
              })
              .catch((error) => {
                console.error('Error fetching chat data:', error)
              });

           }
     )

     return () => {
        unsub();
     }
  },[currentUser.id])

 
  const handelselect = async (chat) => {

    const userChats = chats.map(item => {
      const {user, ...rest} = item
      return rest
    }) 

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)

    userChats[chatIndex].iseen = true
    userChats[chatIndex].lastMessage = chat.lastMessage

    const userChatRef = doc(db, 'userchats', currentUser.id)

    try{
       await updateDoc(userChatRef, {
        chats: userChats,
       })

       changechat(chat.chatId, chat.user)
    }
    catch(err){
       console.log(err)
    }
      
  }


  const filterdchats = chats.filter(c=> c.user.username.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className='chatlist'>
        <div className="search">
          <div className="searchbar">
            <img src={searchimg} alt="" />
            <input type="text" placeholder='Search...' onChange={(e)=>setinput(e.target.value)} />
          </div>
          <img onClick={()=> setaddmode((prev) => !prev)} 
          src={addmode ? minusimg : plusimg} alt="" className='add' />
        </div>

       {filterdchats.map((chat) => (

       <div key={chat.chatId} className="item" onClick={()=>handelselect(chat)} style={{backgroundColor: chat?.iseen ? 'transparent' : '#5183fe'}}>
         <img src={chat.user.avatar || avatarimg} alt="" />
         <div className="texts">
         <span>{chat.user.username}</span>
         <p>{chat.lastMessage}</p>
         </div>
        </div>
       ))}
       
       {addmode && <Adduser/> }
    </div>
  )
}

export default Chatlist
  