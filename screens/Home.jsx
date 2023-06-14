import React from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const Home = ({ navigation }) => {
    const handleSubmit = () => {
        // Handle form submission logic here
        // You can access the form values using the state or refs
    };

    const handleSignUp = () => {
        navigation.navigate("SignUp");
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Email" />
            {/* eslint-disable-next-line prettier/prettier */}
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
