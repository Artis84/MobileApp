import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "@firebase/firestore/lite";
import { FirebaseStorage, getStorage } from "firebase/storage";
import "dotenv/config";
class Db {
    static firebaseApp: FirebaseApp | null = null;
    db: Firestore;
    storage: FirebaseStorage;

    constructor() {
        if (!Db.firebaseApp) {
            console.log("\x1b[31m" + "[EXPRESS]" + "\x1b[0m" + " " + "FirebaseApp initialize");
            Db.firebaseApp = initializeApp({
                apiKey: process.env.API_KEY,
                authDomain: process.env.AUTH_DOMAIN,
                projectId: process.env.PROJECT_ID,
                storageBucket: process.env.STORAGE_BUCKET,
                messagingSenderId: process.env.MESSAGING_SENDER_ID,
                appId: process.env.APP_ID,
            });
            if (process.env.NODE_ENV === "development") {
                const emulatorHost = "127.0.0.1";
                connectFirestoreEmulator(getFirestore(), emulatorHost, 8080);
            }
        }
        this.db = getFirestore();
        this.storage = getStorage();
    }
}

export default Db;
