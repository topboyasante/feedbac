import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbnZNx150_4YDtv9WuC0sTLAeGej_ir1w",
  authDomain: "fir-tuts-50833.firebaseapp.com",
  projectId: "fir-tuts-50833",
  storageBucket: "fir-tuts-50833.appspot.com",
  messagingSenderId: "982378167109",
  appId: "1:982378167109:web:4e62371ad7448a133e9c2c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
