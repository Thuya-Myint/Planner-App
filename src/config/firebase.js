import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyALiQsQLIHWh5FYwzcGqzD20D5xsn4crxs",
  authDomain: "to-do-list-afa5e.firebaseapp.com",
  databaseURL: "https://to-do-list-afa5e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "to-do-list-afa5e",
  storageBucket: "to-do-list-afa5e.appspot.com",
  messagingSenderId: "114542756231",
  appId: "1:114542756231:web:fc1d8f0280d135c5f7d322"
};
const app = initializeApp(firebaseConfig);
const database=getDatabase(app);
export default database;
