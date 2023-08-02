import { collection, updateDoc, getDocs, where, query } from "@firebase/firestore/lite";
import Db from "../../database/ServerDataBase.js";
import { compare } from "bcrypt";

class RefreshPassword extends Db {
    async checkPasswordUniqueness(email, password) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const hashedPassword = userData.password;
        const isPasswordExist = await compare(password, hashedPassword);
        if (isPasswordExist) return false;

        return true;
    }

    async persistUserData(email, password) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        const userDoc = querySnapshot.docs[0];
        const docRef = userDoc.ref;

        await updateDoc(docRef, {
            password: password,
        });
        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + ` Password refreshed: ${docRef.id}`);
    }
}

export default RefreshPassword;
