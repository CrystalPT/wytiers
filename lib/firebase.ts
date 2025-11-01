import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB8boDFdiLVLrr2JvY74mc_QrNeBw-xRn0",
  authDomain: "wytiers.firebaseapp.com",
  projectId: "wytiers",
  storageBucket: "wytiers.firebasestorage.app",
  messagingSenderId: "562948544507",
  appId: "1:562948544507:web:ff867b7e8d9413f6e19d5e"
};

// Initialize Firebase - works on both client and server
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore - works on both client and server
const db = getFirestore(app);

export { db };
export default app;

