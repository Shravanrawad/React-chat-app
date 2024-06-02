import React, { useEffect, useRef, useState } from 'react';
import './chats.css';
import avatarimg from '../../../assets/avatar.png';
import phoneimg from '../../../assets/phone.png';
import videoimg from '../../../assets/video.png';
import infoimg from '../../../assets/info.png';
import emojiimg from '../../../assets/emoji.png';
import imges from '../../../assets/img.png';
import cameraimg from '../../../assets/camera.png';
import micimg from '../../../assets/mic.png';
import EmojiPocker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../store/firebase';
import { useChatStore } from '../store/chatstore';
import { useUserStore } from '../store/userstore';
import upload from '../store/upload';

function Chats() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [chat, setChat] = useState();
  const [img, setImg] = useState({
    file: null,
    url: '',
  });

  const { chatId, user ,isCurrentUserBlocked, isReceiverblocked } = useChatStore();
  const { currentUser,  fetchUserInfo, isloading } = useUserStore();

  const endref = useRef(null);

  useEffect(() => {
    endref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  useEffect(() => {
    if (user) return;
    fetchUserInfo(currentUser.id); 
  }, [user, fetchUserInfo, currentUser.id]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handelemoji = (e) => {
    setText((prev) => prev + e.emoji);
  };

  const handelimg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handelsend = async () => {
    if (text === '') return;

    let imgurl = null;

    try {
      if (img.file) {
        imgurl = await upload(img.file);
      }

      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgurl && { img: imgurl }),
        }),
      });

      const userIds = [currentUser.id, user.id];
      userIds.forEach(async (id) => {
        const userChatRef = doc(db, 'userchats', id);
        const userChatsnapshot = await getDoc(userChatRef);

        if (userChatsnapshot.exists()) {
          const userChatsData = userChatsnapshot.data();

          const chatindex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
          userChatsData.chats[chatindex].lastMessage = text;
          userChatsData.chats[chatindex].isseen = id === currentUser.id ? true : false;
          userChatsData.chats[chatindex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }

    setImg({
      file: null,
      url: '',
    });
    setText('');
  };

  if (isloading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src={user?.avatar || avatarimg} alt='' />
          <div className='texts'>
            <span>{user?.username}</span>
            <p>online</p>
          </div>
        </div>
        <div className='icons'>
          <img src={phoneimg} alt='' />
          <img src={videoimg} alt='' />
          <img src={infoimg} alt='' />
        </div>
      </div>
      <div className='center'>
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser?.id ? 'message own' : 'message'} key={message?.createdAt}>
            <div className='texts'>
              {message.img && <img src={message.img} alt='' />}
              <p>{message.text}</p>
              <span>1min ago</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className='message own'>
            <div className='texts'>
              <img src={img.url} alt='' />
            </div>
          </div>
        )}
        <div ref={endref}></div>
      </div>
      <div className='bottom'>
        <div className='icons'>
          <label htmlFor='file'>
            <img src={imges} alt='' />
          </label>
          <input type='file' id='file' style={{ display: 'none' }} onChange={handelimg} />
          <img src={cameraimg} alt='' />
          <img src={micimg} alt='' />
        </div>
        <input
          disabled={isCurrentUserBlocked || isReceiverblocked}
          onClick={() => setOpen(false)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          type='text'
          placeholder='Message...'
        />
        <div className='emoji'>
          <img onClick={() => setOpen((prev) => !prev)} src={emojiimg} alt='' />
          <div className='picker'>
            <EmojiPocker open={open} onEmojiClick={handelemoji} />
          </div>
        </div>
        <button className='sendbtn' onClick={handelsend} disabled={isCurrentUserBlocked || isReceiverblocked}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chats;
