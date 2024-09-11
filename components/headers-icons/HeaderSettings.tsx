import React from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import SettingsLogo from "../../static/images/svgs/settings-logo.svg";

type headerBackProps = {
    showSettingsModal: any;
};

const HeaderSettings = ({ showSettingsModal }: headerBackProps) => {
    const handleClick = () => {
        showSettingsModal(true);
    };

    return (
        <View style={styles.profileContainer}>
            <View style={styles.iconContainer}>
                <TouchableHighlight onPress={handleClick} underlayColor={"transparent"} activeOpacity={0.7}>
                    <SettingsLogo width={35} height={35} />
                </TouchableHighlight>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        margin: 10,
        // marginBottom: "10%",
    },
    iconContainer: {
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    titleContainer: {
        zIndex: -1,
        position: "absolute",
        width: "100%",
    },
    title: {
        textAlign: "center",
        color: "black",
        fontWeight: "500",
        fontSize: 20,
    },
});

export default HeaderSettings;
