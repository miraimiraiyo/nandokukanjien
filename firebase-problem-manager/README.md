# Firebase Problem Manager - 難訓クイズ

難読漢字クイズの問題データをFirebaseで一元管理するシステムです。

## 実装内容

### ✅ 完了した変更

1. **Firebase設定ファイル** (`src/config/firebase.js`)
   - Firebaseの初期化設定
   - Firestoreの接続設定

2. **問題サービス** (`src/services/problemService.js`)
   - 難易度別に問題を取得
   - 問題の追加・更新・削除機能
   - エラーハンドリング

3. **型定義** (`src/types/question.js`)
   - 問題データの型定義
   - 難易度レベルの定義

4. **クイズ画面統合** (`kanji/exam/script.js`)
   - Firebase Firestoreから問題を取得
   - IndexedDBはスコア・ランキング保存用に
   - ES6モジュール対応

5. **管理画面統合** (`kanji/admin/script.js`)
   - Firebase経由での問題追加・編集・削除
   - リアルタイム同期
   - ES6モジュール対応

## セットアップ手順

### 1. Firebase プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com) にアクセス
2. 新しいプロジェクトを作成
3. Cloud Firestoreを有効化
4. プロジェクト設定からWebアプリ設定を取得

### 2. 設定情報の入力

`kanji/exam/script.js` と `kanji/admin/script.js` の `firebaseConfig` を更新：

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Firestore セキュリティルール設定

管理画面でのみ問題追加を許可する場合：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /questions/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. 初期データ移行（オプション）

既存のIndexedDBから新しいFirebaseへのデータ移行：

- 管理画面から手動で問題を再登録
- または一括インポートスクリプトを作成

## データベース構成

### Firestore Collection: `questions`

```javascript
{
  id: "firestore-document-id",
  level: 5,                        // 0=零級, 1=一級, ... 5=五級
  kanji: "聡",
  readings: ["さとい", "さとし"],
  condition: "名前で",
  source: "広辞苑第七版",
  createdAt: 1672531200000,
  updatedAt: 1672531200000
}
```

## ファイル構成

```
kanji/
├── exam/
│   ├── index.html          (モジュール対応)
│   ├── script.js           (Firebase統合)
│   └── style.css
├── admin/
│   ├── index.html          (モジュール対応)
│   ├── script.js           (Firebase統合)
│   └── style.css
├── manifest.json
└── service-worker.js

firebase-problem-manager/
├── src/
│   ├── config/firebase.js
│   ├── services/problemService.js
│   ├── types/question.js
│   └── ...
└── package.json
```

## 使用方法

### クイズプレイ

1. ルート `index.html` にアクセス
2. 名前を入力
3. 難易度を選択
4. 問題がFirebaseから自動読み込み

### 問題管理

1. `kanji/admin/index.html` にアクセス
2. パスワード「7092」でログイン
3. 難易度を選択
4. 問題を追加・編集・削除

## 注意事項

- **Firebase認証情報**: `firebaseConfig` は本番環境ではセキュアに管理してください
- **スコア保存**: ローカルIndexedDBに保存される（オプションでFirestoreに移行可能）
- **オフライン**: Service Workerでキャッシング対応済み
- **CORS**: Firebase CDNからの読み込みなのでCORS不要

## トラブルシューティング

| 問題 | 原因 | 解決方法 |
|------|------|---------|
| 問題が読み込めない | Firebase設定エラー | コンソールで詳細なエラーを確認 |
| 問題が追加できない | Firestoreセキュリティルール | ルール設定を確認 |
| モジュール読み込みエラー | script tagがtype="module"でない | index.htmlを確認 |

## 今後の拡張

- [ ] ユーザー認証機能
- [ ] スコアをFirestoreに保存
- [ ] ランキング機能の統合
- [ ] 統計情報の表示


3. The API will be available at `http://localhost:3000`.

## API Endpoints

- `POST /problems` - Create a new problem
- `GET /problems` - Retrieve all problems
- `GET /problems/:id` - Retrieve a specific problem by ID
- `PUT /problems/:id` - Update a specific problem by ID
- `DELETE /problems/:id` - Delete a specific problem by ID

## Contributing

Feel free to submit issues or pull requests to improve the project. 

## License

This project is licensed under the MIT License.