import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Button, StyleSheet, Animated } from "react-native";
import SignUpClientSide from "../models/SignUpClientSide.js";
import StatusMark from "../components/StatusMark.jsx";
import Spinner from "../components/Spinner";

const SignUp = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [translateYInputEmail] = useState(new Animated.Value(0));
    const [translateYInputPassword] = useState(new Animated.Value(0));

    const signUpClientSide = new SignUpClientSide();

    const handleSignUp = async () => {
        setLoading(true);
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
            setLoading(false);
            clearTimeout(timeoutId);

            // Check the response status
            if (response.ok) {
                navigation.navigate("Verification", { email: email, codeLengh: 7, action: "Home" });
            } else {
                clearTimeout(timeoutId);
                const error = await response.json();
                if (error.failed) setStatus("Signup failed, invalid data.");
                else throw new Error("Signup failed, please try again");
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            setStatus("Signup failed, please try again.");
        }
    };

    const handleUsernameChange = (username) => {
        setStatus("");
        if (!signUpClientSide.validateUsername(username)) {
            setUsernameError("Username must contain 1 letter / numbers.");
            setUsername("");
        } else {
            checkUsernameUniqueness(username);
        }
    };

    const checkUsernameUniqueness = async (username) => {
        const usernameUniqueness = await signUpClientSide.checkUsernameUniqueness(username);
        if (!usernameUniqueness) {
            setUsernameError("The username is already used");
            setUsername("");
        } else {
            setUsernameError("");
            setUsername(username);
        }
    };

    const handleEmailChange = (email) => {
        setStatus("");
        if (!signUpClientSide.validateEmail(email)) {
            setEmailError("Please enter a valid email address. email@email.com");
            setEmail("");
        } else {
            checkEmailUniqueness(email);
        }
    };

    const checkEmailUniqueness = async (email) => {
        const emailUniqueness = await signUpClientSide.checkEmailUniqueness(email);
        if (!emailUniqueness) {
            setEmailError("The email is already used");
            setEmail("");
        } else {
            setEmailError("");
            setEmail(email);
        }
    };

    const handlePasswordChange = (password) => {
        setStatus("");
        if (!signUpClientSide.validatePassword(password)) {
            setPasswordError("Password must have at least 12 characters, one uppercase letter, one special character(@ $ ! % * ? &), and one digit.");
            setPassword("");
        } else {
            setPasswordError("");
            setPassword(password);
        }
    };

    useEffect(() => {
        if (username) {
            Animated.timing(translateYInputEmail, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
        if (email) {
            Animated.timing(translateYInputPassword, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
    }, [username, email]);

    return (
        <>
            {loading && <Spinner />}
            <View style={styles.container}>
                <View style={[styles.input, usernameError ? styles.errorInput : null]}>
                    <TextInput name="username" placeholder="Username" maxLength={20} onChangeText={handleUsernameChange} />
                    <StatusMark valid={username} invalid={usernameError} />
                </View>
                {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
                <Animated.View
                    style={[
                        styles.input,
                        emailError ? styles.errorInput : null,
                        {
                            transform: [
                                {
                                    translateY: translateYInputEmail.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-20, 0],
                                    }),
                                },
                            ],
                            opacity: translateYInputEmail,
                        },
                    ]}>
                    <TextInput name="email" placeholder="Email" onChangeText={handleEmailChange} autoCapitalize="none" keyboardType="email-address" />
                    <StatusMark valid={email} invalid={emailError} />
                </Animated.View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                <Animated.View
                    style={[
                        styles.input,
                        passwordError ? styles.errorInput : null,
                        {
                            transform: [
                                {
                                    translateY: translateYInputPassword.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-20, 0],
                                    }),
                                },
                            ],
                            opacity: translateYInputPassword,
                        },
                    ]}>
                    <TextInput name="password" placeholder="Password" secureTextEntry={true} maxLength={20} onChangeText={handlePasswordChange} />
                    <StatusMark valid={password} invalid={passwordError} />
                </Animated.View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                {username && email && password ? <Button title="Sign Up" onPress={handleSignUp} /> : null}
                {status ? <Text style={styles.errorText}>{status}</Text> : null}
            </View>
        </>
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
