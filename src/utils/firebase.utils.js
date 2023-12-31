import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  getDoc,
  doc,
  setDoc,

} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPnQx-rUYwn3dFU6VPjkFR0aaOswBJqOc",
  authDomain: "fir-rtc-7a5c8.firebaseapp.com",
  projectId: "fir-rtc-7a5c8",
  storageBucket: "fir-rtc-7a5c8.appspot.com",
  messagingSenderId: "636808638774",
  appId: "1:636808638774:web:fdc094c89db2a462784397"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const createRoomRef = async () => {
  return doc(db, 'stream', "ltj8fcIlx2eqj2dnGsq3ZZa4xzb2");
}