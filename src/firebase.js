// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBzY0yd7zWhDX1JR0okFuVPwoZCM8dBrH4",
  authDomain: "servicio-kids-db.firebaseapp.com",
  projectId: "servicio-kids-db",
  storageBucket: "servicio-kids-db.firebasestorage.app",
  messagingSenderId: "860713914034",
  appId: "1:860713914034:web:56f3ecf078d6320e7703ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
