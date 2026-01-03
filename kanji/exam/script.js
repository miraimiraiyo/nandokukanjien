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
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ローカルストレージ用DB（スコア保存）
const DB = "nankunScoreDB";
const VER = 1;
let localDb;
let user, gradeNow, qs=[], idx=0, score=0, logs=[];

const LEVEL_MAP = {
  "五級": 5,
  "四級": 4,
  "三級": 3,
  "二級": 2,
  "一級": 1,
  "零級": 0
};

const LEVEL_NAMES = {
  5: "五級",
  4: "四級",
  3: "三級",
  2: "二級",
  1: "一級",
  0: "零級"
};

const saveBtn = document.getElementById("saveBtn");
const usernameInput = document.getElementById("username");

function openDB() {
  return new Promise(res => {
    const r = indexedDB.open(DB, VER);
    r.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains("scores"))
        d.createObjectStore("scores",{keyPath:"grade"});
      if (!d.objectStoreNames.contains("ranking"))
        d.createObjectStore("ranking",{keyPath:"name"});
    };
    r.onsuccess = e => res(e.target.result);
  });
}

(async()=>{
  localDb = await openDB();
  user = localStorage.getItem("nankunUser");
  if (user) {
    nameBox.classList.add("hidden");
    select.classList.remove("hidden");
    loadButtons();
    loadRanking();
  }
})();

function saveName() {
  const v = usernameInput.value.trim();
  if (!v) return;
  localStorage.setItem("nankunUser", v);
  location.reload();
}

// ボタンをクリックした時に実行するように登録
saveBtn.addEventListener("click", saveName);

// Enterキーでも保存できるようにする場合
usernameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") saveName();
});

function loadButtons() {
  const base = [
    ["五級","g5"],["四級","g4"],["三級","g3"],["二級","g2"],["一級","g1"]
  ];
  localDb.transaction("scores").objectStore("scores")
    .get("一級").onsuccess = e => {
      const ok = e.target.result && e.target.result.score >= 80;
      if (ok) base.push(["零級","g0"]);
      base.forEach(g=>{
        const d=document.createElement("div");
        d.className=`grade ${g[1]}`;
        d.textContent=g[0];
        d.onclick=()=>start(g[0]);
        buttons.appendChild(d);
      });
    };
}

function start(g) {
  gradeNow=g; idx=0; score=0; logs=[];
  select.classList.add("hidden");
  quiz.classList.remove("hidden");
  
  // Firebaseから問題を取得
  const levelNum = LEVEL_MAP[g];
  const q = query(collection(db, "questions"), where("level", "==", levelNum));
  
  getDocs(q).then(snapshot => {
    qs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .sort(()=>Math.random()-0.5).slice(0,20);
    show();
  }).catch(error => {
    console.error("Error loading questions:", error);
    alert("問題データの取得に失敗しました");
  });
}

function show() {
  if (idx>=qs.length) return finish();
  let html = `<div>${qs[idx].kanji}</div>`;
  if (qs[idx].condition) {
    html += `<div class="condition">（${qs[idx].condition}）</div>`;
  }
  kanjiBox.innerHTML = html;
}

submitBtn.onclick=()=>{
  const a=answer.value.trim();
  // 複数のよみに対応
  let isCorrect = false;
  if (Array.isArray(qs[idx].readings)) {
    isCorrect = qs[idx].readings.includes(a);
  } else if (qs[idx].reading) {
    isCorrect = a === qs[idx].reading;
  }
  logs.push({q:qs[idx],a,isCorrect});
  if (isCorrect) score+=5;
  answer.value="";
  idx++; show();
};

// Enterキーでも回答できるように
answer.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    submitBtn.click();
  }
});

function finish() {
  quiz.classList.add("hidden");
  result.classList.remove("hidden");
  const pct=Math.round(score/(qs.length*5)*100);

  const tx=localDb.transaction(["scores","ranking"],"readwrite");
  tx.objectStore("scores").put({grade:gradeNow,score:pct});
  tx.objectStore("ranking").put({name:user,score:score});

  let h=`<h2>${score}点（${pct}%）</h2>`;
  h+= `<table class="result-table">
    <thead>
      <tr>
        <th>漢字</th>
        <th>正解</th>
        <th>出典</th>
        <th>あなたの回答</th>
      </tr>
    </thead>
    <tbody>`;
  
  logs.forEach(l=>{
    // 複数のよみに対応した表示
    const correctReadings = Array.isArray(l.q.readings) ? l.q.readings.join("、") : l.q.reading || l.q.readings;
    const conditionStr = l.q.condition ? `（${l.q.condition}）` : "";
    const sourceStr = l.q.source ? l.q.source : "—";
    const resultSymbol = l.isCorrect ? "○" : "☓";
    const rowClass = l.isCorrect ? "correct" : "incorrect";
    h+=`<tr class="${rowClass}">
      <td>${l.q.kanji}</td>
      <td>${correctReadings}${conditionStr}</td>
      <td>${sourceStr}</td>
      <td>${l.a} <strong>${resultSymbol}</strong></td>
    </tr>`;
  });
  
  h+=`</tbody></table>`;
  h+=`<button onclick="location.reload()">戻る</button>`;
  result.innerHTML=h;
}

