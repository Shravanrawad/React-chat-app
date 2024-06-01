import { doc, getDoc } from 'firebase/firestore'
import {create} from 'zustand'
import { db } from './firebase'

export const useUserStore = create((set) => ({
    currentUser: null,
    isloading: true,
    fetchUserInfo: async (uid) => {
        if(!uid) return set({currentUser: null, isloading: false})
           
            try{
                const docref = doc(db, 'users', uid) 
                const docSnap  = await getDoc(docref)

                if(docSnap.exists()){
                  set({currentUser: docSnap.data() ,isloading: false})
                }
                else {
                    set({currentUser: null, isloading: false})
                }
            }
            catch(err){
                return set({currentUser: null, isloading: false})
            }
    }
}))