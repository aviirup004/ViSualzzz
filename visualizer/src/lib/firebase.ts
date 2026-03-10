import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase safely (Singleton pattern for Next.js)
let app;
let analytics;
let db: any;

try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);

    // Initialize Analytics, but only on the client side
    if (typeof window !== "undefined") {
        analytics = getAnalytics(app);
    }

    // Initialize Firestore
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase initialization error (Check NEXT_PUBLIC_ env variables!):", error);
}

export { app, analytics, db };

/**
 * Saves a code snippet snapshot to Firestore.
 * 
 * @param codeSnippet - The current code snippet.
 * @param environment - The active environment toggle (e.g., 'Node.js' or 'Browser').
 * @param memoryHeapData - The Memory Heap profiler data.
 * @returns {Promise<string>} The unique document ID for generating a shareable URL.
 */
export async function saveSnippetSnapshot(
    codeSnippet: string,
    environment: string,
    memoryHeapData: any
): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, "snapshots"), {
            codeSnippet,
            environment,
            memoryHeapData,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving snapshot to Firestore: ", error);
        throw error;
    }
}

/**
 * Retrieves a code snippet snapshot from Firestore.
 * 
 * @param id - The unique document ID of the snapshot.
 * @returns {Promise<any>} The snapshot data if found, or null if not found.
 */
export async function getSnippetSnapshot(id: string): Promise<any> {
    try {
        const docRef = doc(db, "snapshots", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null; // Document does not exist
        }
    } catch (error) {
        console.error("Error fetching snapshot from Firestore: ", error);
        throw error;
    }
}
