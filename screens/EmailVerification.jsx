import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Text, Button, StyleSheet, Animated } from "react-native";
import InfoModal from "../components/InfoModal";

const EmailVerification = ({ navigation, route }) => {
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", "", ""]);
    const [verificationStatus, setVerificationStatus] = useState("");
    const [IsCodeOnProgress, setIsCodeOnProgress] = useState(true);
    const [showResendPopUp, setshowResendPopUp] = useState(false);
    const [showConfirmationPopUp, setshowConfirmationPopUp] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const inputRefs = useRef([]);
    const { email, action, codeLengh } = route.params;
    const realCodeLengh = codeLengh - 1;

    const handleVerificationCodeChange = (text, index) => {
        setVerificationCode((prevValues) => {
            const newVerificationCode = [...prevValues];

            // Set the blue border on the current active input when deleting numbers

            if (text.length === 1 && index < realCodeLengh) {
                newVerificationCode[index] = text;
                // Move focus to the next input if it's empty
                const nextEmptyIndex = newVerificationCode.findIndex((newVerificationCode) => !newVerificationCode);
                if (nextEmptyIndex !== -1) {
                    inputRefs.current[nextEmptyIndex].focus();
                }
                if (nextEmptyIndex === realCodeLengh) setIsCodeOnProgress(false);
            } else if (text.length === 0 && index > 0) {
                setIsCodeOnProgress(true);
                // Move focus to the previous input
                inputRefs.current[index - 1].focus();
                inputRefs.current[index - 1].clear();
                newVerificationCode[index - 1] = text;
            }
            if (index === realCodeLengh) {
                newVerificationCode[index] = "";
            }
            return newVerificationCode;
        });
    };

    const handleSubmitCode = async () => {
        setshowConfirmationPopUp(false);
        const verificationCodeInt = parseInt(verificationCode.join(""));
        try {
            // Create the form data
            const formData = new FormData();
            formData.append("email", email);
            formData.append("verificationCode", verificationCodeInt);

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
                setshowConfirmationPopUp(true);
            } else {
                clearTimeout(timeoutId);
                const error = await response.json();
                if (error.failed) setVerificationStatus("Wrong code, please try again");
                else throw new Error();
            }
        } catch (error) {
            console.error(error);
            setVerificationStatus("Verification failed, please try again");
        }
    };

    const handleResendCode = async () => {
        setshowResendPopUp(false);
        const startingNumber = 0.1 * Math.pow(10, realCodeLengh);
        const endingNumber = 0.9 * Math.pow(10, realCodeLengh);
        const verificationCode = Math.floor(startingNumber + Math.random() * endingNumber);

        try {
            // Create the form data
            const formData = new FormData();
            formData.append("email", email);
            formData.append("verificationCode", verificationCode);

            const controller = new AbortController();
            const timeout = 10000;

            const timeoutId = setTimeout(() => {
                controller.abort(); // Abort the request when the timeout is reached
                throw new Error("TIME OUT IS OVER!");
            }, timeout);

            // Send the form data to the server
            const response = await fetch("http://192.168.1.51:8000/resendcode", {
                signal: controller.signal,
                method: "POST",
                body: formData,
            });
            clearTimeout(timeoutId);

            // Check the response status
            if (response.ok) {
                setshowResendPopUp(true);
            } else {
                clearTimeout(timeoutId);
                throw new Error("The email has not been sent, please try again");
            }
        } catch (error) {
            console.error(error);
            setVerificationStatus("The email has not been sent, please try again");
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Text>Please enter the code received in your email box below</Text>
                <View style={styles.inputContainer}>
                    {[...Array(codeLengh)].map((_, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={[
                                styles.input,
                                index === realCodeLengh ? styles.hiddenInput : null,
                                verificationStatus ? styles.errorInput : null,
                                index === activeIndex ? styles.activeInput : null,
                                index === activeIndex ? styles.activeInputScaled : null,
                            ]}
                            keyboardType="numeric"
                            maxLength={1}
                            onChangeText={(text) => handleVerificationCodeChange(text, index)}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === "Backspace") {
                                    handleVerificationCodeChange("", index);
                                }
                            }}
                            onFocus={() => setActiveIndex(index)}
                            onPressOut={() => {
                                handleVerificationCodeChange("", index + 1);
                                setIsCodeOnProgress(true);
                            }}
                            autoFocus={index === 0}
                            caretHidden
                        />
                    ))}
                </View>
                <View style={styles.buttonsContainer}>
                    <Button title="Resend the code" onPress={handleResendCode} />
                    <Button title="Submit" onPress={handleSubmitCode} disabled={IsCodeOnProgress} />
                </View>
                {verificationStatus ? <Text style={styles.status}>{verificationStatus}</Text> : null}
            </View>
            {showResendPopUp && <InfoModal content={`The code has been resend on: ${email.substring(0, 4)}...`} action={undefined} params={undefined} />}
            {showConfirmationPopUp && <InfoModal content="Your account is now verified🎉" action={action} params={action} />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        fontSize: 24,
        width: 50,
        height: 50,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        textAlign: "center",
    },
    activeInput: {
        borderColor: "blue",
        transform: [{ scale: 1 }],
    },
    activeInputScaled: {
        transform: [{ scale: 1.15 }],
    },
    errorInput: {
        borderColor: "red",
    },
    buttonsContainer: {
        flexDirection: "row",
        gap: 50,
    },
    status: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
    hiddenInput: {
        position: "absolute",
        top: 99999999,
        opacity: 0,
    },
});

export default EmailVerification;
