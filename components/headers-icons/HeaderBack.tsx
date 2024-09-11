import React from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import BackArrow from "../../static/images/svgs/left-arrow.svg";

type headerBackProps = {
    parent: string;
    title?: string;
};

const HeaderBack = ({ title, parent }: headerBackProps) => {
    const navigation = useNavigation();
    return (
        <View style={styles.profileContainer}>
            <View style={styles.iconContainer}>
                <TouchableHighlight
                    onPress={() =>
                        navigation.dispatch(
                            CommonActions.navigate({
                                name: parent,
                            })
                        )
                    }
                    underlayColor={"transparent"}
                    activeOpacity={0.7}>
                    <BackArrow width={35} height={35} />
                </TouchableHighlight>
            </View>
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

export default HeaderBack;
