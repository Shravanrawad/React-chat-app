import React from 'react'
import './profiled.css'
import avatarimg from '../../../assets/avatar.png'
import arrowUp from '../../../assets/arrowUp.png'
import arrowdown from '../../../assets/arrowDown.png'
import downloadimg from '../../../assets/download.png'
import {getAuth} from 'firebase/auth'
import { app } from '../store/firebase'
import { useUserStore } from '../store/userstore'
import { useChatStore } from '../store/chatstore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

function Profiled() {
  const auth = getAuth(app)
  const {currentUser} = useUserStore()

  const {chatId, user, isCurrentUserBlocked,  isReceiverblocked, changeblock, changechat} = useChatStore()


  const handelblock = async () => {
        if(!user) return;
        const userDocRef = doc(db, 'users', currentUser.id)

        try{
           await updateDoc(userDocRef, {
              blocked: isReceiverblocked ? arrayRemove(user.id) : arrayUnion(user.id)
           })
           changeblock()
        }
        catch (err){
          console.log(err)
        }
  }
  return (
    <div className='detail'>
       <div className="user">
           <img src={user?.avatar || avatarimg} alt="" />
           <h2>{user?.username}</h2>
           <p>sssdmsd sdmmds</p>
       </div>
       <div className="info">

           <div className="option">
            <div className="title">
              <span>Chat settings</span>
              <img src={arrowUp} alt="" />
            </div>

           </div>
           <div className="option">
            <div className="title">
              <span>Privacy & help</span>
              <img src={arrowUp} alt="" />
            </div>

           </div>
           <div className="option">
            <div className="title">
              <span>Share photos</span>
              <img src={arrowdown} alt="" />
            </div>
            <div className="photos">

              <div className="photoitem">

                <div className="photodetail">
                <img src='https://buffer.com/library/content/images/2023/10/free-images.jpg' alt="" />
                <span>photo 2024</span>
                </div>
                <img src={downloadimg} alt="" className='icon' />
              </div>


              <div className="photoitem">
                <div className="photodetail">
                <img src='https://buffer.com/library/content/images/2023/10/free-images.jpg' alt="" />
                <span>photo 2024</span>
                </div>
                <img src={downloadimg} alt="" className='icon' />
              </div>

            </div>
           </div>

           <div className="option">
            <div className="title">
              <span>Share Files</span>
              <img src={arrowUp} alt="" />
            </div>
           </div>
           <button onClick={handelblock}>{isCurrentUserBlocked ? 'You are blocked!': isReceiverblocked ? 'user blocked' : 'Block user'}</button>
           <button onClick={()=>auth.signOut()} className='logoutbtn'>Logout</button>
       </div>   
    </div>
  )
}

export default Profiled
