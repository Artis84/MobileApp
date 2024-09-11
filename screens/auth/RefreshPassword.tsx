import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LoginClientSide from "../../models/auth/LoginModel";
import StatusMark from "../../components/StatusMark";
import InfoModal from "../../components/InfoPopup";
import Spinner from "../../components/Spinner";
import globale from "../../styles/global";
import { SessionContext } from "../../context/sessionContext";

const RefreshPassword = () => {
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [showConfirmationPopUp, setshowConfirmationPopUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [status, setStatus] = useState("");
    const sessionContext = useContext(SessionContext);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = {
                email: sessionContext.identifier,
                password: password,
            };

            const controller = new AbortController();
            const timeout = 10000;

            const timeoutId = setTimeout(() => {
                controller.abort(); // Abort the request when the timeout is reached
                throw new Error("TIME OUT IS OVER!");
            }, timeout);

            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:8000/refreshPassword", {
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
                setshowConfirmationPopUp(true);
            } else {
                clearTimeout(timeoutId);
                const error = await response.json();
                if (error.passwordExist) setStatus("Please choose a password different that the actual password.");
                else throw new Error("Attempted to refresh the password failed. Please try again");
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            setStatus("Attempted to refresh the password failed. Please try again.");
        }
    };

    const loginClientSide = new LoginClientSide();

    const handlePasswordChange = (password: string) => {
        if (password.length === 0) return;

        if (!loginClientSide.validatePassword(password)) {
            setPassword(password);
            setPasswordError("The password must have at least 12 characters, one uppercase letter, one special character (@$!%*?&), and one digit.");
        } else if (password !== repeatPassword && repeatPassword.length) {
            setPassword(password);
            setPasswordError("The two passwords need to match.");
        } else {
            setPasswordError("");
            setRepeatPasswordError("");
            setPassword(password);
        }
    };

    const handleRepeatPasswordChange = (repeatPassword: string) => {
        if (repeatPassword.length === 0) return;

        if (!loginClientSide.validatePassword(repeatPassword)) {
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
        if (showPassword) {
            setShowPassword(false);
        } else {
            setShowPassword(true);
        }
    };

    return (
        <>
            {loading && <Spinner />}
            <View style={globale.authContainer}>
                <View style={[globale.inputContainer, passwordError ? globale.errorInput : null]}>
                    <TextInput placeholder="Password" onChangeText={handlePasswordChange} secureTextEntry={showPassword} />
                    <StatusMark valid={passwordError.length === 0 && password.length > 0} invalid={passwordError.length > 0} />
                    {(password || passwordError) && (
                        <TouchableHighlight style={styles.iconContainer} onPress={togglePasswordVisibility} underlayColor="transparent">
                            {showPassword ? <Icon name="eye" size={18} color="black" /> : <Icon name="eye-slash" size={18} color="black" />}
                        </TouchableHighlight>
                    )}
                </View>
                {passwordError ? <Text style={globale.errorText}>{passwordError}</Text> : null}
                <View style={[globale.inputContainer, repeatPasswordError ? globale.errorInput : null]}>
                    <TextInput placeholder="Repeat the password" onChangeText={handleRepeatPasswordChange} secureTextEntry={showPassword} />
                    <StatusMark valid={repeatPasswordError.length === 0 && repeatPassword.length > 0} invalid={repeatPasswordError.length > 0} />
                    {(repeatPassword || repeatPasswordError) && (
                        <TouchableHighlight style={styles.iconContainer} onPress={togglePasswordVisibility} underlayColor="transparent">
                            {showPassword ? <Icon name="eye" size={18} color="black" /> : <Icon name="eye-slash" size={18} color="black" />}
                        </TouchableHighlight>
                    )}
                </View>
                {repeatPasswordError ? <Text style={globale.errorText}>{repeatPasswordError}</Text> : null}
                <View style={styles.submitButtonContainer}>
                    <Button title="Reset" onPress={handleSubmit} disabled={repeatPasswordError.length > 0 || passwordError.length > 0} />
                </View>
                {status ? <Text style={globale.errorText}>{status}</Text> : null}
            </View>
            {showConfirmationPopUp && <InfoModal content="Your password has been updated🎉" popupAction={"Login"} />}
        </>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        position: "absolute",
        right: 30,
        top: "25%",
    },
    submitButtonContainer: {
        marginVertical: 10,
        width: "20%",
    },
});

export default RefreshPassword;
