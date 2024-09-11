import { updateDoc } from "@firebase/firestore/lite";
import Miscellaneous from "../../Miscellaneous.ts";

const miscellaneous = new Miscellaneous();

class LogoutModel {
    async removeSessionId(sessionId: string) {
        const userDoc = await miscellaneous.getUserDocWithSessionId(sessionId);
        const userDocRef = userDoc.ref;

        await updateDoc(userDocRef, {
            session_id: null,
        });
    }
}

export default LogoutModel;
