class SignUpModel {
    validateUsername(username: string) {
        const usernameRegex = /^[a-zA-Z0-9-_]+$/;

        if (!usernameRegex.test(username)) {
            return false;
        } else {
            return true;
        }
    }

    async checkUniqueness(username: string | null, email: string | null) {
        const data = {
            username: username,
            email: email,
        };

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const controller = new AbortController();
        const timeout = 10000;

        const timeoutId = setTimeout(() => {
            controller.abort(); // Abort the request when the timeout is reached
            throw new Error("TIME OUT IS OVER!");
        }, timeout);
        try {
            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:8000/signupDataUniqueness", {
                signal: controller.signal,
                headers: headers,
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

    validateEmail(email: string) {
        const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return false;
        } else {
            return true;
        }
    }

    validatePassword(password: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(password)) {
            return false;
        } else {
            return true;
        }
    }
}

export default SignUpModel;
