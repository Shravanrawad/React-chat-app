import { create } from 'zustand';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useUserStore } from './userstore';

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentuserblocked: false,
    isReceiverblocked: false,
    
    changechat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser

        if(user.blocked.includes(currentUser.id)){
           return set({
            chatId,
            user: null,
            isCurrentuserblocked: true,
            isReceiverblocked: false,
           })
        }

       else if(currentUser.blocked.includes(user.id)){
           return set({
            chatId,
            user: user,
            isCurrentuserblocked: false,
            isReceiverblocked: true,
           })
        }
        else{
        return set({
            chatId,
            user,
            isCurrentuserblocked: false,
            isReceiverblocked: false,
        })
    }
    },

    changeblock: ()=> {
        set(state => ({...state,isReceiverblocked: !state.isReceiverblocked}))
    }

}));
