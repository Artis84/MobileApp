import { addDoc, doc, collection, updateDoc, deleteField, getDocs, where, query } from "@firebase/firestore";
import { SMTPClient } from "denomailer";
import Db from "../../models/DataBase.js";

class SignUpServerSide extends Db {
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

    async persistUserData(email = "", verificationCode = "", password = "", username = "") {
        const usersRef = collection(this.db, "users");
        if (!verificationCode) {
            const quere = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(quere);
            const userDoc = querySnapshot.docs[0];
            const docRef = userDoc.ref;

            await updateDoc(docRef, {
                verification_code: deleteField(),
                username: username,
                password: password,
            });
            console.log(`Username saved on this document: ${docRef.id}`);
        } else {
            const doc = await addDoc(usersRef, {
                email: email,
                verification_code: verificationCode,
            });
            console.log(`New entry saved in the db: ${doc.id}`);
        }
    }
}

export default SignUpServerSide;
