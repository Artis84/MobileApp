import { collection, getDocs, where, query, QueryDocumentSnapshot } from "@firebase/firestore/lite";
import Db from "./DataBase";

class Miscellaneous extends Db {
    generateEmoteId() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let id = "";

        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            id += characters[randomIndex];
        }

        return id;
    }

    async getUserDoc(sessionId: string) {
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
