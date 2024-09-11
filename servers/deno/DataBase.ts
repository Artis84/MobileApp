import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "@firebase/firestore/lite";

import { load } from "dotenv";
const env = await load();
class Db {
    static firebaseApp = null;
    db: Firestore;

    constructor() {
        if (!Db.firebaseApp) {
            console.log("\x1b[90m" + "[CRUD]" + "\x1b[0m" + " " + "FirebaseApp initialize");
            Db.firebaseApp = initializeApp({
                apiKey: env["API_KEY"],
                authDomain: env["AUTH_DOMAIN"],
                projectId: env["PROJECT_ID"],
                storageBucket: env["STORAGE_BUCKET"],
                messagingSenderId: env["MESSAGING_SENDER_ID"],
                appId: env["APP_ID"],
            });
            if (Deno.env.get("DENO_ENV") === "development") {
                const emulatorHost = "127.0.0.1";
                connectFirestoreEmulator(getFirestore(), emulatorHost, 8080);
            }
        }
        this.db = getFirestore();
    }
}

export default Db;
