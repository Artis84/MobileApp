import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import LoginClientSide from "../models/LoginClientSide";
import StatusMark from "../components/StatusMark";
import InfoModal from "../components/InfoModal";
import Spinner from "../components/Spinner";

const RefreshPassword = ({ navigation, route }) => {
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [showConfirmationPopUp, setshowConfirmationPopUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const { email } = route.params;

    const handleSubmit = async () => {
        setLoading(true);
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
            const response = await fetch("http://192.168.1.51:8000/refreshPassword", {
                signal: controller.signal,
                method: "POST",
                body: formData,
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

    const handlePasswordChange = async (password) => {
        if (password !== repeatPassword && repeatPassword.length !== 0) {
            setRepeatPasswordError("The two password need to match.");
        }
        if (!loginClientSide.validatePassword(password)) {
            setPasswordError("Password must have at least 12 characters, one uppercase letter, one special character(@$!%*?&), and one digit.");
        } else {
            setPasswordError("");
            setRepeatPasswordError("");
            setPassword(password);
        }
    };
    const handleRepeatPasswordChange = (repeatPassword) => {
        if (password !== repeatPassword) {
            setRepeatPasswordError("The two password need to match.");
        } else {
            setRepeatPasswordError("");
            setRepeatPassword(repeatPassword);
        }
    };

    return (
        <>
            {loading && <Spinner />}
            <View style={styles.container}>
                <View style={[styles.input, passwordError ? styles.errorInput : null]}>
                    <TextInput placeholder="Password" onChangeText={handlePasswordChange} secureTextEntry={true} />
                    <StatusMark valid={password} invalid={!passwordError.length === 0} />
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                <View style={[styles.input, repeatPasswordError ? styles.errorInput : null]}>
                    <TextInput placeholder="Repeat the password" onChangeText={handleRepeatPasswordChange} secureTextEntry={true} />
                    <StatusMark valid={repeatPassword} invalid={!repeatPasswordError.length === 0} />
                </View>
                {repeatPasswordError ? <Text style={styles.errorText}>{repeatPasswordError}</Text> : null}
                <Button title="Reset" onPress={handleSubmit} disabled={repeatPasswordError.length > 0} />
                {status ? <Text style={styles.errorText}>{status}</Text> : null}
            </View>
            {showConfirmationPopUp && <InfoModal content="Your password has been updated🎉" action={"Home"} />}
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
        // padding: 5,
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

export default RefreshPassword;
