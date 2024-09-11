import React from "react";
import { View, StyleSheet, Text } from "react-native";

type HeaderTitleProps = {
    title: string;
};

const HeaderTitle = ({ title }: HeaderTitleProps) => {
    return (
        <View style={styles.profileContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        // flexDirection: "row",
        margin: 10,
        marginBottom: "10%",
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

export default HeaderTitle;
