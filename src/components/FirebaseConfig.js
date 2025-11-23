import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Validar configuração
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
    console.error('Firebase Configuration Error: Missing required fields:', missingFields);
    console.error('Please create a .env file in the root directory with the following variables:');
    console.error('REACT_APP_API_KEY=your_api_key');
    console.error('REACT_APP_AUTH_DOMAIN=your_auth_domain');
    console.error('REACT_APP_PROJECT_ID=your_project_id');
    console.error('REACT_APP_STORAGE_BUCKET=your_storage_bucket');
    console.error('REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id');
    console.error('REACT_APP_APP_ID=your_app_id');
    console.error('REACT_APP_MEASUREMENT_ID=your_measurement_id (optional)');
    throw new Error(`Firebase configuration is incomplete. Missing: ${missingFields.join(', ')}. Please check your .env file.`);
}

let app;
let auth;
let db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    throw new Error(`Failed to initialize Firebase: ${error.message}. Please check your configuration.`);
}

export { auth, db };

