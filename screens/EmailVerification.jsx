import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Button, StyleSheet, Modal } from "react-native";

const EmailVerification = ({ navigation, route }) => {
    const [verificationCode, setverificationCode] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("");
    const [showPopUp, setShowPopUp] = useState(false);
    const { username, email, password } = route.params;

    const handleVerificationCodeChange = (verificationCode) => {
        setverificationCode(verificationCode);
    };
    const handleSubmit = async () => {
        try {
            // Create the form data
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("verificationCode", verificationCode);

            const controller = new AbortController();
            const timeout = 10000;

            const timeoutId = setTimeout(() => {
                controller.abort(); // Abort the request when the timeout is reached
                throw new Error("TIME OUT IS OVER!");
            }, timeout);

            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:8000/emailVerification", {
                signal: controller.signal,
                method: "POST",
                body: formData,
            });
            clearTimeout(timeoutId);

            // Check the response status
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                setShowPopUp(true);
            } else {
                clearTimeout(timeoutId);
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
        } catch (error) {
            console.error(error);
            setVerificationStatus("Wrong code, please try again");
        }
    };

    useEffect(() => {
        if (showPopUp) {
            setTimeout(() => {
                navigation.navigate("Home");
            }, 2000);
        }
    });
    return (
        <View style={styles.container}>
            <TextInput style={[styles.input, verificationStatus ? styles.errorInput : null]} placeholder="Enter the code" keyboardType="numeric" onChangeText={handleVerificationCodeChange} />
            <Button title="Submit" onPress={handleSubmit} />
            <Modal visible={showPopUp} animationType="slide">
                <Text style={styles.modalContent}>Account verified</Text>
            </Modal>
            {verificationStatus ? <Text style={styles.errorText}>{verificationStatus}</Text> : null}
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
    modalContent: {
        textAlign: "center",
        color: "black",
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

export default EmailVerification;
