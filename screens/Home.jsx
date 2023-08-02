import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Animated } from "react-native";
import LoginClientSide from "../models/LoginClientSide";
import StatusMark from "../components/StatusMark";

const Home = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [status, setStatus] = useState("");
    const [translateYInput] = useState(new Animated.Value(0));
    const action = {
        path: "Home",
        email: undefined,
    };

    const handleSubmit = async () => {
        try {
            // Create the form data
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            const controller = new AbortController();
            const timeout = 10000;

            const timeoutId = setTimeout(() => {
                controller.abort(); // Abort the request when the timeout is reached
                throw new Error("TIME OUT IS OVER!");
            }, timeout);

            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:8000/login", {
                signal: controller.signal,
                method: "POST",
                body: formData,
            });
            clearTimeout(timeoutId);

            // Check the response status
            if (response.ok) {
                console.log("Connected");
            } else {
                clearTimeout(timeoutId);
                const error = await response.json();
                if (error.unknowEmail) setEmailError("Unknow email");
                else if (error.VerifiedError) navigation.navigate("EmailVerification", { email: email, codeLengh: 7, action });
                else throw new Error("Login failed. Please try again");
            }
        } catch (error) {
            console.error(error);
            setStatus("Login failed. Please try again.");
        }
    };

    const loginClientSide = new LoginClientSide();

    const handleEmailChange = (email) => {
        if (!loginClientSide.validateEmail(email)) {
            setEmailError("Please enter a valid email address. email@email.com");
            setEmail("");
        } else {
            setEmailError("");
            setEmail(email);
        }
    };

    const handlePasswordChange = (password) => {
        if (!loginClientSide.validatePassword(password)) {
            setPasswordError("Password must have at least 12 characters, one uppercase letter, one special character(@$!%*?&), and one digit.");
            setPassword("");
        } else {
            setPasswordError("");
            setPassword(password);
        }
    };

    useEffect(() => {
        if (email) {
            Animated.timing(translateYInput, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
    }, [email]);

    const handleSignUp = () => {
        navigation.navigate("SignUp");
    };

    const handleForgotPassword = () => {
        navigation.navigate("ForgotPassword");
    };

    return (
        <View style={styles.container}>
            <View style={[styles.input, emailError ? styles.errorInput : null]}>
                <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" onChangeText={handleEmailChange} />
                <StatusMark valid={email} invalid={emailError} />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <Animated.View
                style={[
                    styles.input,
                    passwordError ? styles.errorInput : null,
                    {
                        transform: [
                            {
                                translateY: translateYInput.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-20, 0], // Adjust the outputRange values for larger translation
                                }),
                            },
                        ],
                        opacity: translateYInput,
                    },
                ]}>
                <TextInput placeholder="Password" onChangeText={handlePasswordChange} secureTextEntry={true} />
                <StatusMark valid={password} invalid={passwordError} />
            </Animated.View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <Button title="Connect" onPress={handleSubmit} disabled={!email || !password} />
            {status ? <Text style={styles.errorText}>{status}</Text> : null}
            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Button title="Sign Up" onPress={handleSignUp} />
                </View>
                <View style={styles.button}>
                    <Button title="Forgot Password" onPress={handleForgotPassword} />
                </View>
            </View>
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
        // padding: 5,
        height: 40,
        marginVertical: 10,
        paddingHorizontal: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
    },
    button: {
        alignSelf: "flex-end",
        marginTop: 10,
    },
    buttonContainer: {
        alignSelf: "flex-end",
        marginTop: 50,
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

export default Home;
