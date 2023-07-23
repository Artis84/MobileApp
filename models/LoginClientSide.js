class LoginClientSide {
    validateEmail(email) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return false;
        } else {
            return true;
        }
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
}

export default LoginClientSide;
