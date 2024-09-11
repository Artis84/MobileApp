import { collection, getDocs, query, updateDoc, where } from "@firebase/firestore/lite";
import Db from "../../DataBase.ts";
import Miscellaneous from "../../Miscellaneous.ts";
import { Emote, User } from "../../../express/globals.d.ts";

const miscellaneous = new Miscellaneous();

class EmoteDetailModel extends Db {
    async checkEmoteAlreadyLiked(sessionId: string, emoteId: string) {
        const userDoc = await miscellaneous.getUserDocWithSessionId(sessionId);
        const userData: User = userDoc.data();
        const emotesLiked = userData.emotes_liked;

        const usersRef = collection(this.db, "users");
        if (emotesLiked?.length) {
            const usernameQuerySnapshot = await getDocs(query(usersRef, where("emotes_liked", "array-contains", emoteId)));
            if (!usernameQuerySnapshot.empty) return false;
            else return true;
        } else return true;
    }

    async addEmoteLike(emoteId: string, sessionId: string) {
        const emoteDoc = await miscellaneous.getEmoteDoc(emoteId);
        const emoteRef = emoteDoc.ref;
        const emoteData: Emote = emoteDoc.data();
        const emoteLikesNumber = emoteData.likes! + 1;

        await updateDoc(emoteRef, {
            likes: emoteLikesNumber,
            user_liked: false,
        });

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + `One emote like added: ${emoteRef.id}`);

        const userDoc = await miscellaneous.getUserDocWithSessionId(sessionId);
        const userRef = userDoc.ref;

        await updateDoc(userRef, {
            emotes_liked: [emoteId],
        });

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + `One emote like added in the user profile liked emotes: ${userRef.id}`);
    }

    async removeEmoteLike(emoteId: string, sessionId: string) {
        const emoteDoc = await miscellaneous.getEmoteDoc(emoteId);
        const emoteRef = emoteDoc.ref;
        const emoteData: Emote = emoteDoc.data();
        const emoteLikesNumber = emoteData.likes! - 1;

        await updateDoc(emoteRef, {
            likes: emoteLikesNumber,
        });

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + `One emote like removed: ${emoteRef.id}`);

        const userDoc = await miscellaneous.getUserDocWithSessionId(sessionId);
        const userData: User = userDoc.data();
        const emotesLiked = userData.emotes_liked!;
        const userRef = userDoc.ref;

        const newEmotesLiked = emotesLiked.filter((currentEmoteId: string) => currentEmoteId !== emoteId);

        await updateDoc(userRef, {
            emotes_liked: newEmotesLiked,
        });

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + `One emote like removed in the user profile liked emotes: ${userRef.id}`);
    }
}
export default EmoteDetailModel;
