import { addDoc, collection, getDocs, where, query } from "@firebase/firestore/lite";
import Db from "../../database/ServerDataBase.js";

class SignUpServerSide extends Db {
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
        const uppercaseUsername = username.toUpperCase();
        const usernameQuerySnapshot = await getDocs(query(usersRef, where("username", "in", [lowercaseUsername, uppercaseUsername])));

        if (!usernameQuerySnapshot.empty) {
            return false;
        }

        return true;
    }

    validateEmail(email) {
        // Validate email format
        const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            EmailUniqueness;
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
        // Validate password requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(password)) {
            return false;
        } else {
            return true;
        }
    }

    async persistUserData(email, password, username) {
        const usersRef = collection(this.db, "users");

        const lowercaseUsername = username.toLowerCase();
        const doc = await addDoc(usersRef, {
            isAdmin: false,
            usernames: [username, lowercaseUsername],
            email: email,
            password: password,
        });
        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + ` Email, username and password saved: ${doc.id}`);
    }
}

export default SignUpServerSide;
