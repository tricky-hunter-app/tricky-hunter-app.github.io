import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD-V3Lii8v6AtS5aIQ8ZaeGscA2qaQ1TPw",
  authDomain: "new-words-app-a5fa4.firebaseapp.com",
  databaseURL: "https://new-words-app-a5fa4-default-rtdb.firebaseio.com",
  projectId: "new-words-app-a5fa4",
  storageBucket: "new-words-app-a5fa4.firebasestorage.app",
  messagingSenderId: "533974968135",
  appId: "1:533974968135:web:5446d039251a6dca028e62"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;