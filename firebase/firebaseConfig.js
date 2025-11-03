// firebase/firebaseConfig.js
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyBpNVUZW5D0WaHDYZSuSeNAIDRsUAf0Pb0",
  authDomain: "chat-app-2314b.firebaseapp.com",
  databaseURL:
    "https://chat-app-2314b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-app-2314b",
  storageBucket: "chat-app-2314b.appspot.com",
  messagingSenderId: "929213244063",
  appId: "1:929213244063:web:4226b2889f7023b318f8aa",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const database = firebase.database();
