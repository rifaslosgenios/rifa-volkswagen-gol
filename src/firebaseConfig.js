import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA_LBE9StpmJwtUP3krIQRyzLa0cMRoCvk",
    authDomain: "rifas-los-genios.firebaseapp.com",
    projectId: "rifas-los-genios",
    storageBucket: "rifas-los-genios.firebasestorage.app",
    messagingSenderId: "936731051783",
    appId: "1:936731051783:web:8b0b843ca1edd86fd227a2",
    measurementId: "G-D8QYRBJKWF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);