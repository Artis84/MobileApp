import { collection, getDocs, query, where } from "@firebase/firestore/lite";
import Db from "../database/ClientDataBase.js";

class SignUpClientSide extends Db {
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9-_]{1,20}$/;

        if (!usernameRegex.test(username)) {
            return false;
        } else {
            return true;
        }
    }

    async checkUsernameUniqueness(username) {
        const usersRef = collection(this.db, "users");
        const lowercaseUsername = username.toLowerCase();

        // Query for documents where the lowercase username matches the second value in the usernames array
        const usernameQuerySnapshot = await getDocs(query(usersRef, where("usernames", "array-contains", lowercaseUsername)));

        if (!usernameQuerySnapshot.empty) {
            return false;
        }

        return true;
    }

    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return false;
        } else {
            return true;
        }
    }

    async checkEmailUniqueness(email) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        if (!querySnapshot.empty) {
            return false;
        }

        return true;
    }

    validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(password)) {
            return false;
        } else {
            return true;
        }
    }
}

export default SignUpClientSide;
