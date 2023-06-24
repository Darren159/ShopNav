// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCq78MIOaG7CXSTWRlDVYQOSzniNdkiqqU",
  authDomain: "shopnav-33436.firebaseapp.com",
  projectId: "shopnav-33436",
  storageBucket: "shopnav-33436.appspot.com",
  messagingSenderId: "644946336222",
  appId: "1:644946336222:web:1fc761de2dde100d51e54f",
  measurementId: "G-KSP3YFNMW0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export default storage;
