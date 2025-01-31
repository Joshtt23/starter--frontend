import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check that Firebase has not already been initialized
const apps = getApps()
let app
// Initialize Firebase
if (!apps.length) {
  app = initializeApp(firebaseConfig)
}
// Initialize Firebase Analytics only on the client-side
let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

export { app, auth, analytics } // Export any other Firebase services you use
