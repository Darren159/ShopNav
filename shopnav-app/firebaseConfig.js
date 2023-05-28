import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCq78MIOaG7CXSTWRlDVYQOSzniNdkiqqU",
  authDomain: "shopnav-33436.firebaseapp.com",
  projectId: "shopnav-33436",
  storageBucket: "shopnav-33436.appspot.com",
  messagingSenderId: "644946336222",
  appId: "1:644946336222:web:1fc761de2dde100d51e54f",
  measurementId: "G-KSP3YFNMW0",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
