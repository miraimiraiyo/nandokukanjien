import express from 'express';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './config/firebase';
import problemRoutes from './controllers/problemController';

const app = express();
const port = process.env.PORT || 3000;

// Firebaseの初期化
initializeApp(firebaseConfig);
const db = getFirestore();

// ミドルウェアの設定
app.use(express.json());

// ルートの設定
app.use('/api/problems', problemRoutes);

// サーバーの起動
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});