import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Button, TouchableHighlight, StyleSheet, Animated } from "react-native";
import LoginModel from "../../models/auth/LoginModel";
import StatusMark from "../../components/StatusMark";
import Spinner from "../../components/Spinner";
import Icon from "react-native-vector-icons/FontAwesome";
import { SessionContext } from "../../context/sessionContext";
import globale from "../../styles/global";
import { StackScreenNavigationProp } from "../../types/navigation";
import InfoModal from "../../components/InfoPopup";

const Login = ({ navigation }: StackScreenNavigationProp<"Login">) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [status, setStatus] = useState("");
    const [translateYInput] = useState(new Animated.Value(0));
    const [loging, setloging] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [showNetworkErrorPopUp, setShowNetworkErrorPopUp] = useState(false);
    const sessionContext = useContext(SessionContext);

    const login = new LoginModel();

    const handleSubmit = async () => {
        setloging(true);
        try {
            const data = {
                email: email,
                password: password,
            };

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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            setloging(false);
            clearTimeout(timeoutId);

            if (response.ok) {
                const sessionData = await response.json();
                const sessionId = sessionData.sessionId;

                await sessionContext.setStorage("sessionId", sessionId);

                sessionContext.setContextSessionId(sessionId);
                navigation.navigate("Root");
            } else {
                clearTimeout(timeoutId);
                const error = await response.json();
                if (error.unknowEmail) {
                    setEmailError("Unknow email");
                    setEmail("");
                } else if (error.unknowPassword) {
                    setPasswordError("Unknow password");
                    setPassword("");
                } else if (error.VerifiedError) {
                    sessionContext.setContextSessionId(email);
                    navigation.navigate("Verification", { codeLengh: 7, popupAction: "Login" });
                } else throw new Error("Login failed. Please try again");
            }
        } catch (error) {
            setloging(false);
            console.error(error);
            setStatus("Login failed. Please try again.");
        }
    };

    const handleEmailChange = (email: string) => {
        if (!login.validateEmail(email)) {
            setEmailError("Please enter a valid email address. email@email.com");
        } else {
            setShowPasswordInput(true);
            setEmailError("");
            setEmail(email);
        }
    };

    const handlePasswordChange = (password: string) => {
        setShowPassword(true);
        if (!login.validatePassword(password)) {
            setPasswordError("Password must have at least 12 characters, one uppercase letter, one special character(@$!%*?&), and one digit.");
        } else {
            setPasswordError("");
            setPassword(password);
        }
    };

    const handleSignUp = () => {
        navigation.navigate("SignUp");
    };

    const handleForgotPassword = () => {
        navigation.navigate("ForgotPassword");
    };

    const togglePasswordVisibility = () => {
        if (showPassword) {
            setShowPassword(false);
        } else {
            setShowPassword(true);
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

    return (
        <>
            {loging && <Spinner />}
            <View style={globale.authContainer}>
                <View style={[globale.inputContainer, emailError ? globale.errorInput : null]}>
                    <TextInput placeholder="Email" maxLength={50} autoCapitalize="none" keyboardType="email-address" onChangeText={handleEmailChange} />
                    <StatusMark valid={emailError.length === 0 && email.length > 0} invalid={emailError.length > 0} />
                </View>
                {emailError ? <Text style={globale.errorText}>{emailError}</Text> : null}
                {showPasswordInput && (
                    <Animated.View
                        style={[
                            globale.inputContainer,
                            passwordError ? globale.errorInput : null,
                            {
                                transform: [
                                    {
                                        translateY: translateYInput.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-20, 0], // Adjust the outputRange values for larger translation
                                        }),
                                    },
                                ],
                            },
                        ]}>
                        <TextInput placeholder="Password" onChangeText={handlePasswordChange} maxLength={20} secureTextEntry={showPassword} />
                        <StatusMark valid={passwordError.length === 0 && password.length > 0} invalid={passwordError.length > 0} />
                        {(password || passwordError) && (
                            <TouchableHighlight style={styles.iconContainer} onPress={togglePasswordVisibility} underlayColor="transparent">
                                {showPassword ? <Icon name="eye" size={18} color="black" /> : <Icon name="eye-slash" size={18} color="black" />}
                            </TouchableHighlight>
                        )}
                    </Animated.View>
                )}
                {passwordError ? <Text style={globale.errorText}>{passwordError}</Text> : null}
                <View style={styles.submitButton}>
                    <Button title="Connect" onPress={handleSubmit} disabled={!email || !password} />
                </View>
                {status ? <Text style={globale.errorText}>{status}</Text> : null}
                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Button title="Sign Up" onPress={handleSignUp} />
                    </View>
                    <View style={styles.button}>
                        <Button title="Forgot Password" onPress={handleForgotPassword} />
                    </View>
                </View>
            </View>
            {showNetworkErrorPopUp && <InfoModal content="Cannot reach the server, check your internet connection." />}
        </>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        position: "absolute",
        right: 30,
        top: "25%",
    },
    submitButton: {
        marginVertical: 10,
        width: "25%",
    },
    button: {
        alignSelf: "flex-end",
        marginTop: 10,
    },
    buttonContainer: {
        alignSelf: "flex-end",
        marginTop: 50,
    },
});

export default Login;
