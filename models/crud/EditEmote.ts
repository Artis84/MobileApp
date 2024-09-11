import { DocumentPickerResponse } from "react-native-document-picker";
import { err } from "react-native-svg/lib/typescript/xml";

class EditEmote {
    async checkEmoteNameUniqueness(editedName: string) {
        const data = {
            editedName: editedName,
        };

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);
        try {
            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:8000/checkEditEmoteName", {
                signal: controller.signal,
                method: "POST",
                body: JSON.stringify(data),
            });
            clearTimeout(timeoutId);

            if (response.ok) return true;
            else if (response.status === 400) return false;
            else throw new Error();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    async updateEmote(emoteId: string, editedName: string, updatedEmote: DocumentPickerResponse) {
        const updatedEmoteBinaries: any = updatedEmote;

        const formData = new FormData();
        formData.append("emoteId", emoteId);
        formData.append("editedName", editedName);
        formData.append("updatedEmote", updatedEmoteBinaries);

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);

        try {
            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:3000/editFullEmote", {
                signal: controller.signal,
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });
            clearTimeout(timeoutId);

            if (response.status === 500 || response.status === 400) throw new Error();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    async updateEmoteName(emoteId: string, editedName: string) {
        const data = {
            emoteId: emoteId,
            editedName: editedName,
        };

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);

        try {
            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:3000/editEmoteName", {
                signal: controller.signal,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            clearTimeout(timeoutId);

            if (response.status === 500 || response.status === 400) throw new Error();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    async updateEmoteBinaries(emoteId: string, updatedEmote: DocumentPickerResponse) {
        const updatedEmoteBinaries: any = updatedEmote;

        const formData = new FormData();
        formData.append("emoteId", emoteId);
        formData.append("updatedEmote", updatedEmoteBinaries);

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);

        try {
            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:3000/editEmoteBinaries", {
                signal: controller.signal,
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });
            clearTimeout(timeoutId);

            if (response.status === 500 || response.status === 400) throw new Error();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
}

export default EditEmote;
