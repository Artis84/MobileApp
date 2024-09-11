import { deleteDoc } from "@firebase/firestore/lite";
import { ref, deleteObject } from "firebase/storage";
import Db from "../../DataBase";
import Miscellaneous from "../../Miscellaneous";

const miscellaneous = new Miscellaneous();

class DeleteEmoteModel extends Db {
    async deletingEmoteBinaries(emoteId: string) {
        const emoteRef = ref(this.storage, `/emotes/${emoteId}`);

        await deleteObject(emoteRef);
    }

    async deletingEmoteMetadata(emoteId: string) {
        const emoteDoc = await miscellaneous.getEmoteDoc(emoteId);
        const emoteRef = emoteDoc.ref;

        await deleteDoc(emoteRef);
    }

    async checkValidOwner(sessionId: string, emoteId: string) {
        const userDoc = await miscellaneous.getUserDoc(sessionId);
        const emoteDoc = await miscellaneous.getEmoteDoc(emoteId);

        const userData = userDoc.data();
        const emoteData = emoteDoc.data();

        const emoteAuthor = emoteData.author;
        const username = userData.username[0];
        const isAdamin = userData.is_admin;

        if (emoteAuthor === username || isAdamin) return true;
        else return false;
    }
}

export default DeleteEmoteModel;
