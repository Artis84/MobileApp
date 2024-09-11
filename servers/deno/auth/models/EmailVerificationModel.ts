import { collection, updateDoc, Timestamp, doc, addDoc, getDoc, QueryDocumentSnapshot } from "@firebase/firestore/lite";
import { SMTPClient } from "denomailer";
import Miscellaneous from "../../Miscellaneous.ts";

const miscellaneous = new Miscellaneous();

class EmailVerificationModel {
    static async getVerificationDoc(userDoc: QueryDocumentSnapshot) {
        const userData = userDoc.data();
        const verificationDocId = userData.verification_id;

        const userDocRef = userDoc.ref;
        const verificationRef = collection(userDocRef, "verification");
        const verificationDocRef = doc(verificationRef, verificationDocId);
        return await getDoc(verificationDocRef);
    }

    async sendVerificationEmail(email: string, verificationCode: number) {
        const client = new SMTPClient({
            connection: {
                hostname: "smtp.gmail.com",
                port: 465,
                tls: true,
                auth: {
                    username: "lopsta10@gmail.com",
                    password: "diyt hjdm lcbq qxza",
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

    async checkVerificationCode(email: string, verificationCode: string) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const verificationDoc = await EmailVerificationModel.getVerificationDoc(userDoc);

        const verificationData = verificationDoc.data();
        const originalverificationCode = verificationData.verification_code;

        if (originalverificationCode === verificationCode) return true;

        return false;
    }

    async getUpdatedAttemptsCount(email: string) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const verificationDoc = await EmailVerificationModel.getVerificationDoc(userDoc);

        const verificationData = verificationDoc.data();
        const updatedAttemptsCount = (verificationData.attempts += 1);
        return updatedAttemptsCount;
    }

    async checkMaxAttemptsReach(email: string) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        try {
            await EmailVerificationModel.getVerificationDoc(userDoc);
            return false;
        } catch (_error) {
            return true;
        }
    }

    async persistVerificationDoc(email: string, verificationCode: number) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const userDocRef = userDoc.ref;

        const verificationRef = collection(userDocRef, "verification");
        const expirationTime = new Date();
        const blockedUntil = new Date();
        expirationTime.setHours(expirationTime.getHours() + 24);
        blockedUntil.setSeconds(blockedUntil.getSeconds() + 10);

        const verificationDocRef = await addDoc(verificationRef, {
            verification_code: verificationCode,
            expiration_time: Timestamp.fromDate(expirationTime),
            attempts: 0,
            blocked_until: null,
        });

        await updateDoc(userDocRef, {
            verification_id: verificationDocRef.id,
        });
    }

    async refreshVerificationCode(email: string, verificationCode: number) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const verificationDoc = await EmailVerificationModel.getVerificationDoc(userDoc);
        const verificationDocRef = verificationDoc.ref;

        await updateDoc(verificationDocRef, {
            verification_code: verificationCode,
        });
    }

    async updateAttemptsCount(email: string, attempts: number) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const verificationDoc = await EmailVerificationModel.getVerificationDoc(userDoc);
        const verificationDocRef = verificationDoc.ref;
        const userDocRef = userDoc.ref;
        const verificationData = verificationDoc.data();
        const attemptsCount = verificationData.attempts;

        const blockedUntil = new Date();
        blockedUntil.setSeconds(blockedUntil.getSeconds() + 90);

        // I set attempts field on 0 when the max attemps is reach who is 4
        await updateDoc(verificationDocRef, {
            attempts: attemptsCount == 4 ? 0 : attempts,
            blocked_until: Timestamp.fromDate(blockedUntil),
        });
        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + `Attempts count updated: ${userDocRef.id} -> ${verificationDocRef.id}`);
    }

    async resetVerificationDoc(email: string) {
        const userDoc = await miscellaneous.getUserDocWithEmail(email);
        const verificationDoc = await EmailVerificationModel.getVerificationDoc(userDoc);
        const verificationDocRef = verificationDoc.ref;
        const userDocRef = userDoc.ref;

        await updateDoc(verificationDocRef, {
            verification_code: null,
            attempts: 0,
            blocked_until: null,
        });

        await updateDoc(userDocRef, {
            verified: true,
        });
    }
}

export default EmailVerificationModel;
