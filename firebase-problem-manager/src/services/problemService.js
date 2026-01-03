import { db } from "../config/firebase.js";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

export const problemService = {
  // 難易度別に問題を取得
  async getQuestionsByLevel(level) {
    try {
      const q = query(
        collection(db, "questions"), 
        where("level", "==", level),
        orderBy("id")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  },

  // 全ての問題を取得
  async getAllQuestions() {
    try {
      const snapshot = await getDocs(collection(db, "questions"));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching all questions:", error);
      return [];
    }
  },

  // 問題を追加
  async addQuestion(questionData) {
    try {
      const docRef = await addDoc(collection(db, "questions"), questionData);
      console.log("Question added with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding question:", error);
      throw error;
    }
  },

  // 問題を更新
  async updateQuestion(questionId, questionData) {
    try {
      await updateDoc(doc(db, "questions", questionId), questionData);
      console.log("Question updated:", questionId);
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  },

  // 問題を削除
  async deleteQuestion(questionId) {
    try {
      await deleteDoc(doc(db, "questions", questionId));
      console.log("Question deleted:", questionId);
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  }
};
