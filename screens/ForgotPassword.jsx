import React, { useState } from "react";
import { View, TextInput, Text, Button, StyleSheet } from "react-native";
import StatusMark from "../components/StatusMark.jsx";
import InfoModal from "../components/InfoModal";
import LoginClientSide from "../models/LoginClientSide.js";

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [status, setStatus] = useState("");
    const [showSendEmailPopUp, setShowSendEmailPopUp] = useState(false);
    const action = {
        path: "RefreshPassword",
        email: email,
    };

    const handleSendEmail = async () => {
        setShowSendEmailPopUp(false);
        try {
            // Create the form data
            const formData = new FormData();
            formData.append("email", email);

            const controller = new AbortController();
            const timeout = 10000;

            const timeoutId = setTimeout(() => {
                controller.abort(); // Abort the request when the timeout is reached
                throw new Error("TIME OUT IS OVER!");
            }, timeout);

            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:8000/forgotPassword", {
                signal: controller.signal,
                method: "POST",
                body: formData,
            });
            clearTimeout(timeoutId);

            // Check the response status
            if (response.ok) {
                navigation.navigate("EmailVerification", { email: email, action: action, codeLengh: 6 });
            } else {
                clearTimeout(timeoutId);
                const error = await response.json();
                if (error.unknowEmail) setStatus("Unknow email");
                else throw new Error("Signup failed, please try again");
            }
        } catch (error) {
            console.error(error);
            setStatus("Signup failed, please try again.");
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

    return (
        <>
            <View style={styles.container}>
                <Text>Enter your email account bellow</Text>
                <View style={[styles.input, emailError ? styles.errorInput : null]}>
                    <TextInput name="email" placeholder="Email" onChangeText={handleEmailChange} autoCapitalize="none" keyboardType="email-address" />
                    <StatusMark valid={email} invalid={emailError} />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                <Button title="Send" onPress={handleSendEmail} disabled={!email} />
                {status ? <Text style={styles.errorText}>{status}</Text> : null}
            </View>
            {showSendEmailPopUp && <InfoModal content={"The email has been send successfully"} />}
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
