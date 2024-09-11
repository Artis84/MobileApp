import { updateDoc } from "@firebase/firestore/lite";
import { compare } from "bcrypt";
import Miscellaneous from "../../Miscellaneous.ts";

const miscellaneous = new Miscellaneous();

class RefreshPasswordModel {
    async checkPasswordUniqueness(email: string, password: string) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const userData = userDoc.data();
        const hashedPassword = userData.password;
        const isPasswordExist = await compare(password, hashedPassword);
        if (isPasswordExist) return false;

        return true;
    }

    async persistUserData(email: string, password: string) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const docRef = userDoc.ref;

        await updateDoc(docRef, {
            password: password,
        });
    }
}

export default RefreshPasswordModel;
