// Firebase設定（環境に合わせて更新してください）
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
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const GRADE_MAP = {
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  "1": 1,
  "0": 0
};

let questions = [];

/* ---------- LOGIN ---------- */
async function handleLogin() {
  if (password.value !== "7092") {
    alert("パスワードが違います");
    return;
  }
  loginBox.classList.add("hidden");
  adminBox.classList.remove("hidden");
  loadList();
}

loginBtn.onclick = handleLogin;

// Enterキーでもログイン可能に
password.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleLogin();
  }
});

// 級が変更されたときにリストを更新
grade.addEventListener("change", loadList);

/* ---------- ADD ---------- */
addBtn.onclick = async () => {
  const g = parseInt(grade.value);
  const k = kanji.value.trim();
  const r = reading.value.trim();
  const c = condition.value.trim();
  const s = source.value.trim();
  
  if (!k || !r) {
    alert("漢字とよみは必須です");
    return;
  }

  // よみをカンマで分割し、前後の空白を削除
  const readings = r.split(",").map(x => x.trim()).filter(x => x);
  
  try {
    // 重複チェック
    const q = query(collection(db, "questions"), where("kanji", "==", k), where("level", "==", g));
    const snapshot = await getDocs(q);
    
    const dup = snapshot.docs.some(doc => {
      const docData = doc.data();
      const existingReadings = Array.isArray(docData.readings) ? docData.readings : [docData.reading];
      return readings.some(r => existingReadings.includes(r));
    });

    if (dup) {
      if (!confirm("重複しています。本当に登録しますか？")) return;
    }

    // 問題を追加
    await addDoc(collection(db, "questions"), {
      level: g,
      kanji: k,
      readings: readings,
      condition: c || null,
      source: s || null,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    });

    kanji.value = "";
    reading.value = "";
    condition.value = "";
    source.value = "";
    loadList();
    alert("問題を追加しました");
  } catch (error) {
    console.error("Error adding question:", error);
    alert("追加に失敗しました");
  }
};

/* ---------- LIST ---------- */
async function loadList() {
  const selectedGrade = parseInt(grade.value);
  list.innerHTML = "";
  
  try {
    const q = query(collection(db, "questions"), where("level", "==", selectedGrade));
    const snapshot = await getDocs(q);
    questions = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));

    questions.forEach(q => {
      const li = document.createElement("li");
      const readingStr = Array.isArray(q.readings) ? q.readings.join("、") : q.reading || q.readings;
      const conditionStr = q.condition ? `（${q.condition}）` : "";
      const sourceStr = q.source ? ` - ${q.source}` : "";
      li.textContent = `${q.level}｜${q.kanji}［${readingStr}］${conditionStr}${sourceStr}`;

      const edit = document.createElement("button");
      edit.textContent = "編集";
      edit.onclick = () => {
        const nk = prompt("漢字", q.kanji);
        const nr = prompt("よみ（カンマで複数）", Array.isArray(q.readings) ? q.readings.join(", ") : q.reading || q.readings);
        const nc = prompt("解答条件", q.condition || "");
        const ns = prompt("出典", q.source || "");
        if (!nk || !nr) return;

        const newReadings = nr.split(",").map(x => x.trim()).filter(x => x);
        updateQuestion(q.docId, {
          kanji: nk,
          readings: newReadings,
          condition: nc || null,
          source: ns || null,
          updatedAt: new Date().getTime()
        });
      };

      const del = document.createElement("button");
      del.textContent = "削除";
      del.onclick = () => {
        if (!confirm("削除しますか？")) return;
        deleteQuestion(q.docId);
      };

      const btnContainer = document.createElement("div");
      btnContainer.className = "btn-container";
      btnContainer.appendChild(edit);
      btnContainer.appendChild(del);
      
      li.appendChild(btnContainer);
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading questions:", error);
    alert("問題の取得に失敗しました");
  }
}

async function updateQuestion(docId, data) {
  try {
    await updateDoc(doc(db, "questions", docId), data);
    loadList();
  } catch (error) {
    console.error("Error updating question:", error);
    alert("更新に失敗しました");
  }
}

async function deleteQuestion(docId) {
  try {
    await deleteDoc(doc(db, "questions", docId));
    loadList();
  } catch (error) {
    console.error("Error deleting question:", error);
    alert("削除に失敗しました");
  }
}
