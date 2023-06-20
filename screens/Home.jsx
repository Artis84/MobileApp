import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import SignUpClientSide from "../models/SignUpClientSide.js";

const Home = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async () => {
        try {
            // Create the form data
            const formData = new FormData();
            formData.append("username", username);
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

    const handleUsernameChange = async (username) => {
        const SignUpClientSide = new SignUpClientSide();
        const checkUsernameRecord = await SignUpClientSide.checkUsernameRecord(username);
        if (!checkUsernameRecord) {
            setUsernameError("Username does not existed ");
            setUsername("");
        } else {
            setUsernameError("");
            setUsername(username);
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

    const handleSignUp = () => {
        navigation.navigate("SignUp");
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Email" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
            <Button title="Connect" onPress={handleSubmit} />
            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Button title="Sign Up" onPress={handleSignUp} />
                </View>
                <View style={styles.button}>
                    <Button title="Forgot Password" onPress={() => {}} />
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
});

export default Home;
