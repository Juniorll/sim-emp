// Substitua as credenciais do Firebase abaixo
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBY00_FIB1MaS4IwUhXeIL14_pqZ_AYnyg",
  authDomain: "sim-empresa.firebaseapp.com",
  projectId: "sim-empresa",
  storageBucket: "sim-empresa.firebasestorage.app",
  messagingSenderId: "922527455053",
  appId: "1:922527455053:web:4d2ba4ebf131e48a224904",
  measurementId: "G-23NC8SPXQM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export function ensureAnonymousLogin() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) return resolve(user);
      signInAnonymously(auth).then(() => {
        resolve(auth.currentUser);
      }).catch(()=> resolve(null));
    });
  });
}
