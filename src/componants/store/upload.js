import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import {  storage } from "./firebase.js"

const upload = async (file) => {
      const date = new Date();
      const storageRef = ref(storage, `image${date + file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is' + process + '% done')
            },
            (error) => {
                reject('something went wrong' + error.code)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    resolve(downloadUrl)
                })
            }
        )
    })
}

export default upload