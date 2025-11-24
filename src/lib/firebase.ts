import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

// Demo mode flag - set to false when you add real Firebase credentials
export const DEMO_MODE = false;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAza49laIEIU5IQ_acGhfRB8JLTqxhxBA",
  authDomain: "smartlabsocket.firebaseapp.com",
  databaseURL: "https://smartlabsocket-default-rtdb.firebaseio.com",
  projectId: "smartlabsocket",
  storageBucket: "smartlabsocket.firebasestorage.app",
  messagingSenderId: "36047287852",
  appId: "1:36047287852:web:476d9ebd62e0497d5b0389",
  measurementId: "G-Q8JDY13VSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { auth, database, analytics };
