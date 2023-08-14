import { collection, updateDoc, getDocs, where, query } from "@firebase/firestore/lite";
import Db from "../../database/ServerDataBase.js";
import { compare } from "bcrypt";

class RefreshPassword extends Db {
    static async getUserDoc(email) {
        const db = new Db();
        const usersRef = collection(db.db(), "users");
        const userQuere = query(usersRef, where("email", "==", email));
        const userQuerySnapshot = await getDocs(userQuere);
        return userQuerySnapshot.docs[0];
    }

    async checkPasswordUniqueness(email, password) {
        const userDoc = await RefreshPassword.getUserDoc(email);
        const userData = userDoc.data();
        const hashedPassword = userData.password;
        const isPasswordExist = await compare(password, hashedPassword);
        if (isPasswordExist) return false;

        return true;
    }

    async persistUserData(email, password) {
        const userDoc = await RefreshPassword.getUserDoc(email);
        const docRef = userDoc.ref;

        await updateDoc(docRef, {
            password: password,
        });
        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + ` Password updated: ${docRef.id}`);
    }
}

export default RefreshPassword;
