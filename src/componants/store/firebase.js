import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
  apiKey: 'AIzaSyAugInIgNPb3K7NAJFANmzJP5_InV1l_q4',
  authDomain: "chatapp-d0074.firebaseapp.com",
  projectId: "chatapp-d0074",
  storageBucket: "chatapp-d0074.appspot.com",
  messagingSenderId: "854408715262",
  appId: "1:854408715262:web:85f71a3efc35df9215beaf"
};

export const app = initializeApp(firebaseConfig)
export default firebaseConfig

export const db = getFirestore()
export const storage = getStorage()

