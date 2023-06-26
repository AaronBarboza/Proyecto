import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD1L5flSNKscoZMw386c_ws1rh6avkpxjw",
  authDomain: "proyectoprogra-2f23b.firebaseapp.com",
  projectId: "proyectoprogra-2f23b",
  storageBucket: "proyectoprogra-2f23b.appspot.com",
  messagingSenderId: "141467543321",
  appId: "1:141467543321:web:8852163f55685540308788",
  measurementId: "G-WP907H9ZRQ",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const database = getDatabase(app);
