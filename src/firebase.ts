import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";

export const firebaseConfig = process.env.REACT_APP_DEV
  ? {
      apiKey: "AIzaSyBou72P3KP1OFoUXJUwYefJ78xm3vSOHcc",
      authDomain: "fpvmap-beta.firebaseapp.com",
      projectId: "fpvmap-beta",
      storageBucket: "fpvmap-beta.appspot.com",
      messagingSenderId: "456055601189",
      appId: "1:456055601189:web:1c75b0fa82eb22236d67cc",
      measurementId: "G-0BL0YZ8DSQ",
    }
  : {
      apiKey: "AIzaSyBrdQOA4hx0E0_OHkjNZD0aQmeRJf-PCO4",
      authDomain: "fpv-map-20aaa.firebaseapp.com",
      projectId: "fpv-map-20aaa",
      storageBucket: "fpv-map-20aaa.appspot.com",
      messagingSenderId: "594067448026",
      appId: "1:594067448026:web:0672208fd8a9242e8045e3",
      measurementId: "G-626T26REX6",
    };

export const mapLibraries: Libraries = ["places"];
