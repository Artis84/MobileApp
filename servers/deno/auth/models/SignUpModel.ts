import { addDoc, collection, getDocs, where, query, Timestamp } from "@firebase/firestore/lite";
import Db from "../../DataBase.ts";

class SignUpServerSide extends Db {
    validateUsername(username: string) {
        const usernameRegex = /^[a-zA-Z0-9-_]{1,20}$/;

        if (!usernameRegex.test(username)) {
            return false;
        } else {
            return true;
        }
    }

    async checkUsernameUniqueness(username: string) {
        const usersRef = collection(this.db, "users");
        const lowercaseUsername = username.toLowerCase();
        const uppercaseUsername = username.toUpperCase();
        const usernameQuerySnapshot = await getDocs(query(usersRef, where("username", "in", [lowercaseUsername, uppercaseUsername])));

        if (!usernameQuerySnapshot.empty) {
            return false;
        }

        return true;
    }

    validateEmail(email: string) {
        // Validate email format
        const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return false;
        } else {
            return true;
        }
    }

    async checkEmailUniqueness(email: string) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        if (!querySnapshot.empty) {
            return false;
        }

        return true;
    }

    validatePassword(password: string) {
        // Validate password requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,20}$/;
        if (!passwordRegex.test(password)) {
            return false;
        } else {
            return true;
        }
    }

    async persistUserData(email: string, password: string, username: string) {
        const usersRef = collection(this.db, "users");
        const date = new Date();

        const lowercaseUsername = username.toLowerCase();
        await addDoc(usersRef, {
            create_at: Timestamp.fromDate(date),
            username: [username, lowercaseUsername],
            email: email,
            password: password,
            emotes_liked: [],
            is_admin: false,
            verified: false,
        });
    }
}

export default SignUpServerSide;
