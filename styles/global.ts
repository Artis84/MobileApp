import { StyleSheet } from "react-native";

const globale = StyleSheet.create({
    CreationContainer: {
        marginHorizontal: 10,
    },
    centerContainer: {
        alignItems: "center",
        marginTop: "50%",
        gap: 10,
    },
    authContainer: {
        marginTop: "50%",
        alignItems: "center",
        gap: 10,
    },
    iconContainer: {
        position: "absolute",
        right: 30,
        top: "25%",
    },
    inputContainer: {
        width: "80%",
        height: 40,
        paddingRight: 30,
        paddingLeft: 10,
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
    },
    rippleEffect: {
        padding: 3,
    },
});

export default globale;
