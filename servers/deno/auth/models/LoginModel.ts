import { collection, getDocs, where, query, updateDoc } from "@firebase/firestore/lite";
import { compare } from "bcrypt";
import Miscellaneous from "../../Miscellaneous.ts";
import Db from "../../DataBase.ts";

const miscellaneous = new Miscellaneous();

class LoginModel extends Db {
    async checkEmailRecord(email: string) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        if (!querySnapshot.empty) {
            return true;
        }

        return false;
    }

    async checkPasswordRecord(email: string, password: string) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const userData = userDoc.data();
        const hashedPassword = userData.password;
        const isPasswordExist = await compare(password, hashedPassword);
        if (isPasswordExist) return true;

        return false;
    }

    async checkAccountVerification(email: string) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const userData = userDoc.data();
        const verificationCode = userData.verified;
        if (!verificationCode) return false;
        return true;
    }

    async persistAuthenticationData(email: string, sessionId: string, lastLoginAt: Date) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const userDocRef = userDoc.ref;

        await updateDoc(userDocRef, {
            session_id: sessionId,
            last_login_at: lastLoginAt,
        });
    }
}

export default LoginModel;
