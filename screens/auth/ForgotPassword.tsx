import React, { useState, useContext } from "react";
import { View, TextInput, Text, Button, StyleSheet } from "react-native";
import StatusMark from "../../components/StatusMark";
import LoginClientSide from "../../models/auth/LoginModel";
import Spinner from "../../components/Spinner";
import globale from "../../styles/global";
import { SessionContext } from "../../context/sessionContext";
import { StackScreenNavigationProp } from "../../types/navigation";

const SignUp = ({ navigation }: StackScreenNavigationProp<"ForgotPassword">) => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const sessionContext = useContext(SessionContext);

    const handleSendEmail = async () => {
        setLoading(true);
        try {
            const data = {
                email: email,
            };

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
                navigation.navigate("Verification", { popupAction: "RefreshPassword", codeLengh: 6 });
            } else {
                clearTimeout(timeoutId);
                const error = await response.json();
                if (error.unknowEmail) setStatus("Unknow email");
                else throw new Error();
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            setStatus("Signup failed, please try again.");
        }
    };

    const loginClientSide = new LoginClientSide();
    const handleEmailChange = (email: string) => {
        if (!loginClientSide.validateEmail(email) && email.length) {
            setEmailError("Please enter a valid email address. email@email.com");
        } else {
            setEmailError("");
            setEmail(email);
        }
    };

    return (
        <>
            {loading && <Spinner />}
            <View style={globale.authContainer}>
                <Text>Enter your email account bellow</Text>
                <View style={[globale.inputContainer, emailError ? globale.errorInput : null]}>
                    <TextInput placeholder="Email" onChangeText={handleEmailChange} autoCapitalize="none" keyboardType="email-address" />
                    <StatusMark valid={emailError.length === 0 && email.length > 0} invalid={emailError.length > 0} />
                </View>
                {emailError ? <Text style={globale.errorText}>{emailError}</Text> : null}
                <View style={styles.submitButton}>
                    <Button title="Send" onPress={handleSendEmail} disabled={!email} />
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
