import React, { useState, useEffect, useContext } from "react";
import { View, TextInput, Text, Button, StyleSheet, Animated, TouchableHighlight } from "react-native";
import SignUpModel from "../../models/auth/SignUpModel";
import StatusMark from "../../components/StatusMark";
import Spinner from "../../components/Spinner";
import globale from "../../styles/global";
import { SessionContext } from "../../context/sessionContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { StackScreenNavigationProp } from "../../types/navigation";

const SignUp = ({ navigation }: StackScreenNavigationProp<"SignUp">) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [showEmail, setShowEmail] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [showRepeatPasswordInput, setShowRepeatPasswordInput] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [showReapeatPassword, setShowReapeatPassword] = useState(true);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [pendingUsername, setPendingUsername] = useState(false);
    const [pendingEmail, setPendingEmail] = useState(false);
    const sessionContext = useContext(SessionContext);
    const [translateYInputEmail] = useState(new Animated.Value(0));
    const [translateYInputPassword] = useState(new Animated.Value(0));
    const [translateYInputRepeatPassword] = useState(new Animated.Value(0));

    const signUp = new SignUpModel();

    const handleSignUp = async () => {
        setLoading(true);
        try {
            const data = {
                username: username,
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
            const response = await fetch("http://192.168.1.51:8000/signup", {
                signal: controller.signal,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            setLoading(false);
            clearTimeout(timeoutId);

            // Check the response status
            if (response.ok) {
                sessionContext.setContextSessionId(email);
                navigation.navigate("Verification", { codeLengh: 7, popupAction: "Login" });
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

    const handleUsernameChange = (username: string) => {
        setStatus("");
        if (!username.length) {
            setUsername("");
            return;
        }

        if (!signUp.validateUsername(username)) {
            setUsernameError("Username must contain only letter and numbers.");
        } else {
            checkUsernameUniqueness(username);
        }
    };
    const checkUsernameUniqueness = async (username: string) => {
        try {
            setPendingUsername(true);
            const usernameUniqueness = await signUp.checkUniqueness(username, null);
            setPendingUsername(false);
            if (!usernameUniqueness) {
                setUsernameError("The username is already used");
            } else {
                setUsernameError("");
                setUsername(username);
                setShowEmail(true);
            }
        } catch (error) {
            setPendingUsername(false);
            setUsernameError("The username cannot be verified due to an error");
        }
    };

    const handleEmailChange = (email: string) => {
        setStatus("");
        if (!email.length) {
            setEmail("");
            return;
        }
        if (!signUp.validateEmail(email)) setEmailError("Please enter a valid email address. email@email.com");
        else checkEmailUniqueness(email);
    };

    const checkEmailUniqueness = async (email: string) => {
        try {
            setPendingEmail(true);
            const emailUniqueness = await signUp.checkUniqueness(null, email);
            setPendingEmail(false);
            if (!emailUniqueness) {
                setEmailError("The email is already used");
            } else {
                setEmailError("");
                setEmail(email);
                setShowPasswordInput(true);
            }
        } catch (error) {
            setPendingEmail(false);
            setUsernameError("The email cannot be verified due to an error");
        }
    };

    const handlePasswordChange = (password: string) => {
        if (password.length === 0) return;

        if (!signUp.validatePassword(password)) {
            setPassword(password);
            setPasswordError("The password must have at least 12 characters, one uppercase letter, one special character (@$!%*?&), and one digit.");
        } else if (password !== repeatPassword && repeatPassword.length) {
            setPassword(password);
            setPasswordError("The two passwords need to match.");
        } else {
            setPasswordError("");
            setRepeatPasswordError("");
            setPassword(password);
            setShowRepeatPasswordInput(true);
        }
    };

    const handleRepeatPasswordChange = (repeatPassword: string) => {
        if (repeatPassword.length === 0) return;

        if (!signUp.validatePassword(repeatPassword)) {
            setRepeatPassword(repeatPassword);
            setRepeatPasswordError("The password must have at least 12 characters, one uppercase letter, one special character (@$!%*?&), and one digit.");
        } else if (password !== repeatPassword) {
            setRepeatPassword(repeatPassword);
            setRepeatPasswordError("The two passwords need to match.");
        } else {
            setRepeatPasswordError("");
            setPasswordError("");
            setRepeatPassword(repeatPassword);
        }
    };

    const togglePasswordVisibility = () => {
        showPassword ? setShowPassword(false) : setShowPassword(true);
    };
    const toggleRepeatPasswordVisibility = () => {
        showReapeatPassword ? setShowReapeatPassword(false) : setShowReapeatPassword(true);
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
        if (password) {
            Animated.timing(translateYInputRepeatPassword, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
    }, [username, email, password]);

    return (
        <>
            {loading && <Spinner />}
            <View style={globale.authContainer}>
                <View style={[globale.inputContainer, usernameError ? globale.errorInput : null]}>
                    <TextInput placeholder="Username" maxLength={20} onChangeText={handleUsernameChange} />
                    <StatusMark valid={usernameError.length === 0 && username.length > 0} invalid={usernameError.length > 0} pending={pendingUsername} />
                </View>
                {usernameError ? <Text style={globale.errorText}>{usernameError}</Text> : null}
                {showEmail && (
                    <Animated.View
                        style={[
                            globale.inputContainer,
                            emailError ? globale.errorInput : null,
                            {
                                transform: [
                                    {
                                        translateY: translateYInputEmail.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-20, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}>
                        <TextInput placeholder="Email" onChangeText={handleEmailChange} autoCapitalize="none" keyboardType="email-address" />
                        <StatusMark valid={emailError.length === 0 && email.length > 0} invalid={emailError.length > 0} pending={pendingEmail} />
                    </Animated.View>
                )}
                {emailError ? <Text style={globale.errorText}>{emailError}</Text> : null}
                {showPasswordInput && (
                    <Animated.View
                        style={[
                            globale.inputContainer,
                            passwordError ? globale.errorInput : null,
                            {
                                transform: [
                                    {
                                        translateY: translateYInputPassword.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-20, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}>
                        <TextInput placeholder="Password" secureTextEntry={showPassword} maxLength={20} onChangeText={handlePasswordChange} />
                        <StatusMark valid={passwordError.length === 0 && password.length > 0} invalid={passwordError.length > 0} />
                        {(password || passwordError) && (
                            <TouchableHighlight style={globale.iconContainer} onPress={togglePasswordVisibility} underlayColor="transparent">
                                {showPassword ? <Icon name="eye" size={18} color="black" /> : <Icon name="eye-slash" size={18} color="black" />}
                            </TouchableHighlight>
                        )}
                    </Animated.View>
                )}
                {passwordError ? <Text style={globale.errorText}>{passwordError}</Text> : null}
                {showRepeatPasswordInput && (
                    <Animated.View
                        style={[
                            globale.inputContainer,
                            repeatPasswordError ? globale.errorInput : null,
                            {
                                transform: [
                                    {
                                        translateY: translateYInputRepeatPassword.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-20, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}>
                        <TextInput placeholder="Repeat password" secureTextEntry={showReapeatPassword} maxLength={20} onChangeText={handleRepeatPasswordChange} />
                        <StatusMark valid={repeatPasswordError.length === 0 && repeatPassword.length > 0} invalid={repeatPasswordError.length > 0} />
                        {(repeatPassword || repeatPasswordError) && (
                            <TouchableHighlight style={globale.iconContainer} onPress={toggleRepeatPasswordVisibility} underlayColor="transparent">
                                {showReapeatPassword ? <Icon name="eye" size={18} color="black" /> : <Icon name="eye-slash" size={18} color="black" />}
                            </TouchableHighlight>
                        )}
                    </Animated.View>
                )}
                {repeatPasswordError ? <Text style={globale.errorText}>{repeatPasswordError}</Text> : null}
                <View style={styles.submitButton}>
                    <Button title="Sign Up" onPress={handleSignUp} disabled={!username || !email || !password || !repeatPassword} />
                </View>
                {status ? <Text style={globale.errorText}>{status}</Text> : null}
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    submitButton: {
        marginVertical: 10,
        width: "20%",
    },
});

export default SignUp;
