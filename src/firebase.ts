// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrdQOA4hx0E0_OHkjNZD0aQmeRJf-PCO4",
  authDomain: "fpv-map-20aaa.firebaseapp.com",
  projectId: "fpv-map-20aaa",
  storageBucket: "fpv-map-20aaa.appspot.com",
  messagingSenderId: "594067448026",
  appId: "1:594067448026:web:0672208fd8a9242e8045e3",
  measurementId: "G-626T26REX6",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
