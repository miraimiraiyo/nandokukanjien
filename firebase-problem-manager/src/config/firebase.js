// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyD7mQ3tf_CGFofq0QwETR5uKG7SKR0NmQA",
    authDomain: "nankunquiz-cf4c9.firebaseapp.com",
    projectId: "nankunquiz-cf4c9",
    storageBucket: "nankunquiz-cf4c9.firebasestorage.app",
    messagingSenderId: "1072732924342",
    appId: "1:1072732924342:web:6d053dde11eec613db3917"
};

// Firebase初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
