import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Demo mode flag - set to false when you add real Firebase credentials
export const DEMO_MODE = true;

// Replace with your Firebase configuration
// Get these values from: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  databaseURL: "https://demo-project-default-rtdb.firebaseio.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

let app;
let auth;
let database;

// Only initialize Firebase if not in demo mode
if (!DEMO_MODE) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  database = getDatabase(app);
}

export { auth, database };
