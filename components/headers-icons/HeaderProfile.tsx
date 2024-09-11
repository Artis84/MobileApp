import React from "react";
import { View, Image, Text, StyleSheet, TouchableHighlight } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import ProfilePicture from "../../static/images/svgs/default_profil_picture.svg";

type headerProfileProps = {
    title?: string;
};
const HeaderProfile = ({ title }: headerProfileProps) => {
    const navigation = useNavigation();
    return (
        <View style={styles.profileContainer}>
            <View style={styles.iconContainer}>
                <TouchableHighlight
                    onPress={() =>
                        navigation.dispatch(
                            CommonActions.navigate({
                                // key: `Profile-${Math.random()}`, // Changing the key will force re-render
                                name: "Profile",
                            })
                        )
                    }
                    underlayColor={"transparent"}
                    activeOpacity={0.7}>
                    <ProfilePicture width={35} height={35} />
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
        marginBottom: "10%",
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

export default HeaderProfile;
