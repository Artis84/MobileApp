import { addDoc, collection, updateDoc, deleteField, getDocs, where, query, Timestamp } from "@firebase/firestore/lite";
import { SMTPClient } from "denomailer";
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

    async sendVerificationEmail(email, verificationCode) {
        const client = new SMTPClient({
            connection: {
                hostname: "smtp.gmail.com",
                port: 465,
                tls: true,
                auth: {
                    username: "lopsta10@gmail.com",
                    password: "erfmttphrorqqxho",
                },
            },
        });
        await client.send({
            from: "jaivraimentpasdargent@gmail.com",
            to: email,
            subject: "Verifiaction code",
            content: `Your verification code is ${verificationCode}`,
            html: `Your verification code is <i>${verificationCode}</i><br /><br />You have 24 hours to verify your account before the delation `,
        });
        console.log(`Email sent on: ${email}`);
        await client.close();
    }

    async emailVerification(email, verificationCode) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const OriginalverificationCode = userData.verification_code;

        if (OriginalverificationCode == verificationCode) return true;

        return false;
    }

    async persistResendcode(email, verificationCode) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        const userDoc = querySnapshot.docs[0];
        const docRef = userDoc.ref;

        await updateDoc(docRef, {
            verification_code: verificationCode,
        });
        console.log(`Resend code: ${docRef.id}`);
    }

    // TODO MOVE THE FIRST IF STATEMENT AND CREATE A METHODE
    async persistUserData(email = "", verificationCode = "", password = "", username = "") {
        const usersRef = collection(this.db, "users");
        if (!verificationCode) {
            const quere = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(quere);
            const userDoc = querySnapshot.docs[0];
            const docRef = userDoc.ref;

            await updateDoc(docRef, {
                verification_code: deleteField(),
            });
            console.log(`Account verified, account password saved: ${docRef.id}`);
        } else {
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
            console.log(`Email, username and verification_code(temporary) saved in the db: ${doc.id}`);
        }
    }
}

export default SignUpServerSide;
