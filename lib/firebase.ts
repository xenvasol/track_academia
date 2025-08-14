import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDQscStnnxjZNCvMft_dVwbPXV4WZhK15k",
  authDomain: "ts-code-68f33.firebaseapp.com",
  projectId: "ts-code-68f33",
  storageBucket: "ts-code-68f33.firebasestorage.app",
  messagingSenderId: "813766241984",
  appId: "1:813766241984:web:d434cfa26c3b4a1e934725",
  measurementId: "G-R4YN5JZPGD",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
