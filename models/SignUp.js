class SignUpModels {
    handleUsernameChange(username) {
        const usernameRegex = /^[a-zA-Z0-9-_]{1,20}$/; // Regex pattern to allow letters, numbers, hyphens, and underscores

        if (!usernameRegex.test(username)) {
            return false;
        } else {
            return true;
        }
    }

    handleEmailChange(email) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return false;
        } else {
            return true;
        }
    }

    handlePasswordChange(password) {
        // Validate password requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(password)) {
            return false;
        } else {
            return true;
        }
    }
}

export default SignUpModels;
