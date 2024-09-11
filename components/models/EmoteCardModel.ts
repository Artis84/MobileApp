class EmoteCardModel {
    getFormateDate = (timestamp: string) => {
        const date = new Date(timestamp);

        const options: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
        };

        const frenchDate = date.toLocaleDateString("fr-FR", options);
        return frenchDate.slice(0, -1);
    };

    async addEmoteLike(emoteId: string, sessionId: string) {
        const data = {
            emoteId: emoteId,
            sessionId: sessionId,
        };

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
            controller.abort(); // Abort the request when the timeout is reached
            throw new Error();
        }, timeout);
        try {
            // Send the form data to the server
            const response: Response = await fetch("http://192.168.1.51:8000/addEmoteLike", {
                signal: controller.signal,
                headers: headers,
                method: "POST",
                body: JSON.stringify(data),
            });
            clearTimeout(timeoutId);

            if (response.status === 500) throw new Error();
            if (response.status === 400) return false;
            else return true;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    async deletingEmote(sessionId: string, emoteId: string) {
        const data = {
            emoteId: emoteId,
            sessionId: sessionId,
        };

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
            controller.abort(); // Abort the request when the timeout is reached
            throw new Error();
        }, timeout);
        try {
            // Send the form data to the server
            const response: Response = await fetch("http://192.168.1.51:3000/deleteEmote", {
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

    async checkValidOwner(sessionId: string, emoteId: string) {
        const data = {
            emoteId: emoteId,
            sessionId: sessionId,
        };

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
            controller.abort(); // Abort the request when the timeout is reached
            throw new Error();
        }, timeout);
        try {
            // Send the form data to the server
            const response: Response = await fetch("http://192.168.1.51:3000/checkValidOwner", {
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
}

export default EmoteCardModel;
