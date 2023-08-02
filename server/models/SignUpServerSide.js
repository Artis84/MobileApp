import { addDoc, collection, updateDoc, deleteField, getDocs, where, query, Timestamp } from "@firebase/firestore/lite";
import Db from "../../database/ServerDataBase.js";

class SignUpServerSide extends Db {
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9-_]{1,20}$/; // Regex pattern to allow letters, numbers, hyphens, and underscores

        if (!usernameRegex.test(username)) {
            return false;
        } else {
            return true;
        }
    }

    async checkUsernameUniqueness(username) {
        const usersRef = collection(this.db, "users");
        const lowercaseQuerySnapshot = await getDocs(query(usersRef, where("username", "==", username.toLowerCase())));
        const uppercaseQuerySnapshot = await getDocs(query(usersRef, where("username", "==", username.toUpperCase())));

        if (!lowercaseQuerySnapshot.empty || !uppercaseQuerySnapshot.empty) {
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
            return false; // Email already exists
        }

        return true; // Email is valid and unique
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

    async persistUserData(email, verificationCode, password, username) {
        const usersRef = collection(this.db, "users");
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 24);

        const doc = await addDoc(usersRef, {
            isAdmin: false,
            username: username,
            email: email,
            password: password,
            verification_code: verificationCode,
            expirationTime: Timestamp.fromDate(expirationTime),
        });
        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + ` Email, username and verification_code(temporary) saved: ${doc.id}`);
    }
}

export default SignUpServerSide;
