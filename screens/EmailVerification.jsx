import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Text, Button, Keyboard, StyleSheet, Animated } from "react-native";
import InfoModal from "../components/InfoModal";
import Spinner from "../components/Spinner";

const EmailVerification = ({ route }) => {
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", "", ""]);
    const [verificationStatus, setVerificationStatus] = useState("");
    const [IsCodeOnProgress, setIsCodeOnProgress] = useState(true);
    const [showResendPopUp, setshowResendPopUp] = useState(false);
    const [showConfirmationPopUp, setshowConfirmationPopUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const inputRefs = useRef([]);
    const { email, action, codeLengh, params } = route.params;
    const realCodeLength = codeLengh - 1;

    const handleVerificationCodeChange = (text, index) => {
        setVerificationCode((prevValues) => {
            const newVerificationCode = [...prevValues];

            if (text.length === 1 && index < realCodeLength) {
                newVerificationCode[index] = text;
                // Move focus to the next input if it's empty
                const nextEmptyIndex = newVerificationCode.findIndex((newVerificationCode) => !newVerificationCode);
                if (nextEmptyIndex !== -1) {
                    inputRefs.current[nextEmptyIndex].focus();
                }
                if (nextEmptyIndex === realCodeLength) setIsCodeOnProgress(false);
            } else if (text.length === 0 && index > 0) {
                setIsCodeOnProgress(true);
                // Move focus to the previous input
                inputRefs.current[index - 1].focus();
                inputRefs.current[index - 1].clear();
                newVerificationCode[index - 1] = text;
            }
            if (index === realCodeLength) {
                newVerificationCode[index] = "";
            }
            return newVerificationCode;
        });
    };

    const handleSubmitCode = async () => {
        setshowConfirmationPopUp(false);
        setLoading(true);
        const verificationCodeStr = verificationCode.join("");
        try {
            // Create the form data
            const formData = new FormData();
            formData.append("email", email);
            formData.append("verificationCode", verificationCodeStr);

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
            setLoading(false);
            clearTimeout(timeoutId);

            // Check the response status
            if (response.ok) {
                setshowConfirmationPopUp(true);
            } else {
                clearTimeout(timeoutId);
                const error = await response.json();
                if (error.failed) setVerificationStatus("Wrong code, please try again");
                else if (error.attempts) {
                    setVerificationStatus("You have reach your the max attemps, please try again in 60 seconds");
                } else throw new Error("Verification failed, please try again");
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            setVerificationStatus("Verification failed, please try again");
        }
    };

    const handleResendCode = async () => {
        setshowResendPopUp(false);
        setLoading(true);
        const startingNumber = 0.1 * Math.pow(10, realCodeLength);
        const endingNumber = 0.9 * Math.pow(10, realCodeLength);
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
            setLoading(false);
            clearTimeout(timeoutId);

            // Check the response status
            if (response.ok) {
                setshowResendPopUp(true);
            } else {
                clearTimeout(timeoutId);
                throw new Error("The email has not been sent, please try again");
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            setVerificationStatus("The email has not been sent, please try again");
        }
    };

    return (
        <>
            {loading && <Spinner />}
            <View style={styles.container}>
                <Text>Please enter the code received in your email box below</Text>
                <View style={styles.inputContainer}>
                    {[...Array(codeLengh)].map((_, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={[
                                styles.input,
                                index === realCodeLength ? styles.hiddenInput : null,
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
            {showResendPopUp && <InfoModal content={`The code has been resend on: ${email.substring(0, 4)}...`} />}
            {showConfirmationPopUp && <InfoModal content="Your account is now verified🎉" action={action} params={params} />}
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
