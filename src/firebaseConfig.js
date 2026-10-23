// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_LBE9StpmJwtUP3krIQRyzLa0cMRoCvk",
    authDomain: "rifas-los-genios.firebaseapp.com",
    projectId: "rifas-los-genios",
    storageBucket: "rifas-los-genios.firebasestorage.app",
    messagingSenderId: "936731051783",
    appId: "1:936731051783:web:8b0b843ca1edd86fd227a2",
    measurementId: "G-D8QYRBJKWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);