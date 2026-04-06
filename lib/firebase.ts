import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUzAyo8ftmINda3_CQHYTjAf-eMutqjfw",
  authDomain: "controle-financeiro-72f6f.firebaseapp.com",
  projectId: "controle-financeiro-72f6f",
  storageBucket: "controle-financeiro-72f6f.firebasestorage.app",
  messagingSenderId: "972083539874",
  appId: "1:972083539874:web:ab04b573e268814bab8cfb"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);