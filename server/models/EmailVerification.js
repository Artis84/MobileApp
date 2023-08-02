import { collection, updateDoc, getDocs, where, query, deleteField } from "@firebase/firestore/lite";
import { SMTPClient } from "denomailer";
import Db from "../../database/ServerDataBase.js";

class EmailVerification extends Db {
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
        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + ` Email sent on: ${email}`);
        await client.close();
    }

    async emailVerification(email, verificationCode) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);

        const userDoc = querySnapshot.docs[0];
        const docRef = userDoc.ref;
        const userData = userDoc.data();
        const OriginalverificationCode = userData.verification_code;

        if (OriginalverificationCode == verificationCode) {
            console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + ` Account verified: ${docRef.id}`);
            return true;
        }

        return false;
    }

    async deleteVerificationCode(email) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        const userDoc = querySnapshot.docs[0];
        const docRef = userDoc.ref;

        await updateDoc(docRef, {
            verification_code: deleteField(),
        });
    }

    async persistVerificationCode(email, verificationCode) {
        const usersRef = collection(this.db, "users");
        const quere = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(quere);
        const userDoc = querySnapshot.docs[0];
        const docRef = userDoc.ref;

        await updateDoc(docRef, {
            verification_code: verificationCode,
        });
        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + ` Saved verificationCode on: ${docRef.id}`);
    }
}

export default EmailVerification;
