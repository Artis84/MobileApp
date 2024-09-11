import { QueryDocumentSnapshot, updateDoc } from "@firebase/firestore/lite";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import Db from "../../DataBase";
import Miscellaneous from "../../Miscellaneous";

const miscellaneous = new Miscellaneous();

class EditEmoteModel extends Db {
    async persistUpdatedEmote(emoteId: string, emoteName: string, emoteBinary: ArrayBuffer, emoteMime: string) {
        const emoteDoc = await miscellaneous.getEmoteDoc(emoteId);
        const emoteRef = emoteDoc.ref;
        await updateDoc(emoteRef, {
            name: emoteName,
        });

        const storageRef = ref(this.storage, `/emotes/${emoteId}`);
        const metadata = {
            contentType: emoteMime,
        };
        await uploadBytes(storageRef, emoteBinary, metadata);

        const updatedEmoteUrl = await getDownloadURL(storageRef);

        await updateDoc(emoteRef, {
            src: updatedEmoteUrl,
        });
    }

    async persistUpdatedEmoteBinaries(emoteId: string, emoteBinary: ArrayBuffer, emoteMime: string) {
        const storageRef = ref(this.storage, `/emotes/${emoteId}`);
        const metadata = {
            contentType: emoteMime,
        };
        await uploadBytes(storageRef, emoteBinary, metadata);

        const emoteDoc = await miscellaneous.getEmoteDoc(emoteId);
        const emoteRef = emoteDoc.ref;

        const updatedEmoteUrl = await getDownloadURL(storageRef);

        await updateDoc(emoteRef, {
            src: updatedEmoteUrl,
        });
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

    async persistUpdatedEmoteName(emoteId: string, emoteName: string) {
        const emoteDoc = await miscellaneous.getEmoteDoc(emoteId);
        const emoteRef = emoteDoc.ref;

        await updateDoc(emoteRef, {
            name: emoteName,
        });
    }
}

export default EditEmoteModel;
