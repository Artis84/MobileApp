import { collection, getDocs, where, query, updateDoc } from "@firebase/firestore/lite";
import Db from "../../DataBase.ts";
// import Miscellaneous from "../../Miscellaneous.ts";

// const miscellaneous = new Miscellaneous();

class CreateModel extends Db {
    async checkEmoteNameUniqueness(name: string) {
        const emotesRef = collection(this.db, "emotes");
        const usernameQuerySnapshot = await getDocs(query(emotesRef, where("name", "==", name)));

        if (usernameQuerySnapshot.empty) {
            return false;
        }

        return true;
    }
}

export default CreateModel;
