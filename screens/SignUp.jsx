import React, { useState } from "react";
import { View, TextInput, Text, Button, StyleSheet } from "react-native";
import SignUpClientSide from "../models/SignUpClientSide.js";

const SignUp = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [status, setStatus] = useState("");

    const signUpClientSide = new SignUpClientSide();

    const handleSignUp = async () => {
        try {
            // Create the form data
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);

            const controller = new AbortController();
            const timeout = 10000;

            const timeoutId = setTimeout(() => {
                controller.abort(); // Abort the request when the timeout is reached
                throw new Error("TIME OUT IS OVER!");
            }, timeout);

            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:8000/signup", {
                signal: controller.signal,
                method: "POST",
                body: formData,
            });
            clearTimeout(timeoutId);

            // Check the response status
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                navigation.navigate("EmailVerification", { username: username, email: email, password: password });
            } else {
                clearTimeout(timeoutId);
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
        } catch (error) {
            console.error(error);
            setStatus("Signup failed. Please try again.");
        }
    };

    const handleUsernameChange = (username) => {
        if (!signUpClientSide.validateUsername(username)) {
            setUsernameError("Username can only contain letters, numbers, -, _");
            setUsername("");
        } else {
            setUsernameError("");
            setUsername(username);
        }
    };

    const checkUsernameRecord = async () => {
        const usernameUniqueness = await signUpClientSide.checkUsernameUniqueness(username);
        if (!usernameUniqueness) {
            setUsernameError("The username is already used");
            setUsername("");
        }
    };

    const handleEmailChange = (email) => {
        if (!signUpClientSide.validateEmail(email)) {
            setEmailError("Please enter a valid email address. email@email.com");
            setEmail("");
        } else {
            setEmailError("");
            setEmail(email);
        }
    };

    const checkEmailUniqueness = async () => {
        const emailUniqueness = await signUpClientSide.checkEmailUniqueness(email);
        if (!emailUniqueness) {
            setEmailError("The email is already used");
            setEmail("");
        }
    };

    const handlePasswordChange = (password) => {
        if (!signUpClientSide.validatePassword(password)) {
            setPasswordError("Password must have at least 12 characters, one uppercase letter, one special character(@$!%*?&), and one digit.");
        } else {
            setPasswordError("");
            setPassword(password);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput name="username" style={[styles.input, usernameError ? styles.errorInput : null]} placeholder="Username" maxLength={20} onChangeText={handleUsernameChange} />
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            <TextInput
                name="email"
                style={[styles.input, emailError ? styles.errorInput : null]}
                placeholder="Email"
                onChangeText={handleEmailChange}
                onFocus={checkUsernameRecord}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!username.length == 0}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <TextInput
                name="password"
                style={[styles.input, passwordError ? styles.errorInput : null]}
                disabled={!email}
                placeholder="Password"
                secureTextEntry={true}
                maxLength={20}
                onChangeText={handlePasswordChange}
                onFocus={checkEmailUniqueness}
                editable={!email.length == 0}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <Button title="Sign Up" onPress={handleSignUp} disabled={!username || !email || !password || !status.length == 0} />
            {status ? <Text style={styles.errorText}>{status}</Text> : null}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        width: "80%",
        height: 40,
        marginVertical: 10,
        paddingHorizontal: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
    },
    errorInput: {
        borderColor: "red",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
});

export default SignUp;
