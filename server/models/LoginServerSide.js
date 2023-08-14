import { collection, getDocs, where, getDoc, doc, query } from "@firebase/firestore/lite";
import Db from "../../database/ServerDataBase.js";
import { compare } from "bcrypt";

class LoginServerSide extends Db {
    static async getUserDoc(email) {
        const db = new Db();
        const usersRef = collection(db.db, "users");
        const userQuere = query(usersRef, where("email", "==", email));
        const userQuerySnapshot = await getDocs(userQuere);
        return userQuerySnapshot.docs[0];
    }

    async checkEmailRecord(email) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        if (!querySnapshot.empty) {
            return true;
        }

        return false;
    }

    async checkPasswordRecord(email, password) {
        const userDoc = await LoginServerSide.getUserDoc(email);
        const userData = userDoc.data();
        const hashedPassword = userData.password;
        const isPasswordExist = await compare(password, hashedPassword);
        if (isPasswordExist) return true;

        return false;
    }

    async checkAccountVerification(email) {
        const userDoc = await LoginServerSide.getUserDoc(email);
        const userData = userDoc.data();
        const verificationDocId = userData.verification_id;

        const userDocRef = userDoc.ref;
        const verificationRef = collection(userDocRef, "verification");
        const verificationDocRef = doc(verificationRef, verificationDocId);
        const verificationDoc = await getDoc(verificationDocRef);
        const verificationData = verificationDoc.data();
        const verificationCode = verificationData.verification_code;
        if (!verificationCode) return true;
        return false;
    }
}

export default LoginServerSide;
