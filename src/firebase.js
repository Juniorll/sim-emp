// Substitua as credenciais do Firebase abaixo
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'REPLACE_WITH_YOUR_APIKEY',
  authDomain: 'REPLACE_WITH_YOUR_AUTHDOMAIN',
  projectId: 'REPLACE_WITH_YOUR_PROJECTID',
  storageBucket: 'REPLACE_WITH_YOUR_STORAGEBUCKET',
  messagingSenderId: 'REPLACE_WITH_YOUR_MESSAGINGSENDERID',
  appId: 'REPLACE_WITH_YOUR_APPID'
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