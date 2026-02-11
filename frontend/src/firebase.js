// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxwrew5xDOTDMSfO_NV_nVlAT77Kvu0_c",
  authDomain: "unixhub-4367b.firebaseapp.com",
  projectId: "unixhub-4367b",
  storageBucket: "unixhub-4367b.firebasestorage.app",
  messagingSenderId: "787584927623",
  appId: "1:787584927623:web:1c3a367338df6794bff522",
  measurementId: "G-GNS9PXBLD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
