import { db } from '../config/firebase';
import { Problem } from '../types';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const problemsCollection = collection(db, 'problems');

export const createProblem = async (problemData: Problem) => {
    const docRef = await addDoc(problemsCollection, problemData);
    return { id: docRef.id, ...problemData };
};

export const getProblems = async () => {
    const querySnapshot = await getDocs(problemsCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Problem));
};

export const updateProblem = async (id: string, problemData: Partial<Problem>) => {
    const problemDoc = doc(db, 'problems', id);
    await updateDoc(problemDoc, problemData);
    return { id, ...problemData };
};

export const deleteProblem = async (id: string) => {
    const problemDoc = doc(db, 'problems', id);
    await deleteDoc(problemDoc);
    return { id };
};