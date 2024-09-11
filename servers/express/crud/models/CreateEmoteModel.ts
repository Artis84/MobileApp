import { collection, Timestamp, addDoc, DocumentData } from "@firebase/firestore/lite";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import Db from "../../DataBase";
import Miscellaneous from "../../Miscellaneous";

const miscellaneous = new Miscellaneous();

class CreateEmoteModel extends Db {
    async persistEmoteMetadata(userData: DocumentData, emoteId: string, emoteSrc: string, name: string, tags: []) {
        const userName = userData.username[0];
        const emotesRef = collection(this.db, "emotes");
        const creationDate = new Date();

        const emoteDocRef = await addDoc(emotesRef, {
            src: emoteSrc,
            emote_id: emoteId,
            author: userName,
            name: name,
            tags: tags,
            likes: null,
            create_at: Timestamp.fromDate(creationDate),
        });
    }
    async persistEmote(emoteId: string, emoteBinary: ArrayBuffer, emoteMime: string) {
        const storageRef = ref(this.storage, `/emotes/${emoteId}`);
        const metadata = {
            contentType: emoteMime,
        };
        await uploadBytes(storageRef, emoteBinary, metadata);
        const src = await getDownloadURL(storageRef);
        return src;
    }
}

export default CreateEmoteModel;
