import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-RNt_4F7rfsJDn39_3tX5STTu45qXR9Q",
  authDomain: "blog-react-676fa.firebaseapp.com",
  projectId: "blog-react-676fa",
  storageBucket: "blog-react-676fa.firebasestorage.app",
  messagingSenderId: "635935224012",
  appId: "1:635935224012:web:5d9f3037cc7ddb24bf5269",
  measurementId: "G-J54TMM6R78"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
