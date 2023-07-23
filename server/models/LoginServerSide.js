import { collection, updateDoc, getDocs, where, query } from "@firebase/firestore/lite";
import Db from "../../database/ServerDataBase.js";

class LoginServerSide extends Db {
    async checkEmailRecord(email) {
        try {
            const usersRef = collection(this.db, "users");
            const quere = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(quere);
            if (!querySnapshot.empty) return true;

            return false;
        } catch (error) {
            throw error;
        }
    }

    async checkAccountVerification(email) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        if (userData.hasOwnProperty("verification_code")) {
            return false;
        } else {
            return true;
        }
    }

    async refreshVerificationCode(email, verificationCode) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        const userDoc = querySnapshot.docs[0];
        const docRef = userDoc.ref;

        await updateDoc(docRef, {
            verification_code: verificationCode,
        });
        console.log(`Refreshing verificationCode: ${docRef.id}`);
    }
}

export default LoginServerSide;
