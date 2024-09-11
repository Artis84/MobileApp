import { collection, getDocs, where, query, QueryDocumentSnapshot } from "@firebase/firestore/lite";
import Db from "./DataBase.ts";

class Miscellaneous extends Db {
    generateSessionId(name: string) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let id;
        id = `${name}`;

        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            id += characters[randomIndex];
        }

        return id;
    }

    async getUserDocWithEmail(email: string): Promise<QueryDocumentSnapshot> {
        const usersRef = collection(this.db, "users");
        const userQuere = query(usersRef, where("email", "==", email));
        const userQuerySnapshot = await getDocs(userQuere);
        return userQuerySnapshot.docs[0];
    }
    async getUserDocWithSessionId(sessionId: string): Promise<QueryDocumentSnapshot> {
        const usersRef = collection(this.db, "users");
        const userQuere = query(usersRef, where("session_id", "==", sessionId));
        const userQuerySnapshot = await getDocs(userQuere);
        return userQuerySnapshot.docs[0];
    }

    async getEmoteDoc(emoteId: string): Promise<QueryDocumentSnapshot> {
        const usersRef = collection(this.db, "emotes");
        const userQuere = query(usersRef, where("emote_id", "==", emoteId));
        const userQuerySnapshot = await getDocs(userQuere);
        return userQuerySnapshot.docs[0];
    }
}

export default Miscellaneous;
