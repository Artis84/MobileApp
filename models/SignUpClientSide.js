import { collection, getDocs, query, where } from "@firebase/firestore";
import Db from "./DataBase.js";

class SignUpClientSide extends Db {
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9-_]{1,20}$/; // Regex pattern to allow letters, numbers, hyphens, and underscores

        if (!usernameRegex.test(username)) {
            return false;
        } else {
            return true;
        }
    }

    async checkUsernameRecord(username) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(quere);
        if (!querySnapshot.empty) {
            return false; // Email already exists
        }

        return true; // Email is valid and unique
    }

    validateEmail(email) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
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
}

export default SignUpClientSide;
