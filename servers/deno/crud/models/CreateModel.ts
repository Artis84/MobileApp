import { collection, getDocs, where, query } from "@firebase/firestore/lite";
import Db from "../../DataBase.ts";

class CreateModel extends Db {
    async checkNameUniqueness(name: string) {
        const emotesRef = collection(this.db, "emotes");
        const usernameQuerySnapshot = await getDocs(query(emotesRef, where("name", "==", name)));

        if (usernameQuerySnapshot.empty) {
            return false;
        }

        return true;
    }
    async checkTagUniqueness(tag: string) {
        const emotesRef = collection(this.db, "emotes");
        const usernameQuerySnapshot = await getDocs(query(emotesRef, where("tags", "array-contains", tag)));

        if (usernameQuerySnapshot.empty) {
            return false;
        }

        return true;
    }
}

export default CreateModel;
