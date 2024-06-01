import React, { useState } from 'react';
import './login.css';
import avatarimg from '../../../assets/avatar.png';
import { toast } from 'react-toastify';
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { app } from '../store/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../store/firebase';
import upload from '../store/upload';



function Login({user,updateuser}) {

  const [avatar, setAvatar] = useState({
    file: null,
    url: ''
  });

  const [loading, setloading] = useState(false)

  const [showLogin, setShowLogin] = useState(true);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handelwithoutlogin = () => {
    updateuser(true)
  }

  const handellogin = async (e) => {
    e.preventDefault()
    const auth = getAuth(app)
    setloading(true)
    const formdata  = new FormData(e.target)
    const {email, password} = Object.fromEntries(formdata)
    try{  
      await signInWithEmailAndPassword(auth,email,password)
      toast.success('Logged in success')
    }
    catch(err){
      console.log(err)
      toast.error(err.message)
    }finally {
      setloading(false)
    }

  }


  const handelregister = async (e) => {
    e.preventDefault()
    const auth = getAuth(app)
    setloading(true)
    const formdata  = new FormData(e.target)
    const {username, email, password} = Object.fromEntries(formdata)
    try{
       const usercreadential = await createUserWithEmailAndPassword(auth,email,password)
       const imgurl = await upload(avatar.file)

       await setDoc(doc(db, 'users', usercreadential.user.uid),{
         username,
         email,
         avatar: imgurl,
         id: usercreadential.user.uid,
         blocked: []
       })
       

       await setDoc(doc(db, 'userchats', usercreadential.user.uid),{
          chats: [],
       })
       
       toast.success('Account created! You can login now')
    }
    catch(err){
      console.log(err)
      toast.error(err.message)
    }finally {
      setloading(false)
    }
  }

  

  return (
    <div className='login'>
      {showLogin ? (
        <div className="item">
          <h2>Log in</h2>
          <form onSubmit={handellogin}>
            <input type="email" placeholder='Email' name='email' />
            <input type="password" placeholder='password' name='password' />
            <button disabled={loading}>{loading ? 'Loading...' : 'Log in'}</button>
            <button disabled={loading} onClick={() => setShowLogin(false)}>Create account</button>
            <p onClick={handelwithoutlogin} style={{cursor: 'pointer', borderBottom: '2px solid white', paddingBottom: '2px'}}>Use without Login</p>
          </form>
        </div>
      ) : (
        <div className="item">
          <h2>Create an Account</h2>
          <form onSubmit={handelregister}>
            <label htmlFor="file">
              <img src={avatar.url || avatarimg} alt="" />
              Upload image
            </label>
            <input type="file" id='file' style={{ display: 'none' }} onChange={handleAvatar} />
            <input type="text" placeholder='Username' name='username' />
            <input type="text" placeholder='Email' name='email' />
            <input type="password" placeholder='password' name='password' />
            <button disabled={loading}>{ loading ? 'Loading...': 'Create Account' }</button>
            <button disabled={loading} onClick={() => setShowLogin(true)}>Login</button>
          </form>
        </div>
      )}

    </div>
  );
}

export default Login;
