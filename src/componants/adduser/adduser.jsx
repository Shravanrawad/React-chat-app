import React, { useState } from 'react'
import './adduser.css'
import avatarimg from '../../../assets/avatar.png';
import { db } from '../store/firebase'
import { arrayUnion, collection,  doc,  getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useUserStore } from '../store/userstore';

function Adduser() {

  const [user,setuser] = useState([])
  const {currentUser} = useUserStore()

  const handelsearch = async (e) => {
    e.preventDefault()
    const formdata = new FormData(e.target)
    const username = formdata.get('username')

    try{
       const userRef = collection(db, 'users')

       const q = query(userRef, where('username', '==', username))

       const querySnapShot = await getDocs(q)

       if(!querySnapShot.empty){
           setuser(querySnapShot.docs[0].data())
       }
    }
    catch(err){
      console.log(err)
    }
  }


  const handeladd = async () => {

    const chatRef = collection(db, 'chats')
    const userChatRef = collection(db, 'userchats')

    try{

        const newChatref = doc(chatRef)

        await setDoc(newChatref, {
        createdAt: serverTimestamp(),
        messages:[],
      })

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatref.id,
          lastMessage: '',
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        })
      })

      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatref.id,
          lastMessage: '',
          receiverId: user.id,
          updatedAt: Date.now(),
        })
      })

      console.log(newChatref.id)
    }
    catch(err){
      console.log(err)
    }

  }


  return (
    <div className='adduser'>
       <form onSubmit={handelsearch}>
         <input type="text" placeholder='Username' name='username' />
         <button>Search</button>
       </form>
       { user && <div className="user">
          <div className="detail">
            <img src={user.avatar} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handeladd}>Add user</button>
         </div> 
       }
    </div>
  )
}

export default Adduser
