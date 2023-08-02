import { collection, getDocs, where, query } from "@firebase/firestore/lite";
import Db from "../../database/ServerDataBase.js";

class LoginServerSide extends Db {
    async checkEmailRecord(email) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        if (!querySnapshot.empty) {
            return true;
        }

        return false;
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
}

export default LoginServerSide;
