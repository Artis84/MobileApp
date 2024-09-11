class CreateModel {
    validateName(name: string) {
        // Validate email format
        const emailRegex = /^[a-zA-Z0-9-_]+$/;
        if (!emailRegex.test(name)) {
            return false;
        } else {
            return true;
        }
    }

    validateTag(tags: string) {
        // Validate email format
        const emailRegex = /^[a-zA-Z0-9-,]+$/;
        if (!emailRegex.test(tags)) {
            return false;
        } else {
            return true;
        }
    }

    async checkUniqueness(name: string | null, tag: string | null) {
        const data = {
            name: name,
            tag: tag,
        };

        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
            controller.abort(); // Abort the request when the timeout is reached
            throw new Error("TIME OUT IS OVER!");
        }, timeout);
        try {
            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:8000/createVerification", {
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
}

export default CreateModel;
