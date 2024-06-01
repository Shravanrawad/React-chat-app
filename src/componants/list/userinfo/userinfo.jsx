import React from 'react'
import './userinfo.css'
import moreimg  from '../../../../assets/more.png'
import videoimg  from '../../../../assets/video.png'
import editimg  from '../../../../assets/edit.png'
import avatarimg  from '../../../../assets/avatar.png'
import { useUserStore } from '../../store/userstore'

function Userinfo() {
  const {currentUser} = useUserStore()

  return (
    <div className='userinfo'>
        <div className="user">
            <img src={currentUser.avatar || avatarimg} alt="" />
            <h3>{currentUser.username}</h3>
        </div>
        <div className="icons">
          <img src={moreimg} alt="" />
          <img src={videoimg} alt="" />
          <img src={editimg} alt="" />
        </div>
    </div>
  )
}

export default Userinfo
