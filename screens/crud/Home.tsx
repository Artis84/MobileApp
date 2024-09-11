// NOTE: I NEED TO SET THE EMOTE ID TO THE CONTEXT BECAUSE THE NAVIGATOR CollectionEmotesDetail IS A NESTED NAVIGATOR THAT REDIRECT TO THE COMPONENENT CollectionEmotesDetailScreen SO ALL PARAMS VANISHED IN THIS COMPONENT.

import React, { useEffect, useContext, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableHighlight, Animated } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_RECENT_EMOTES } from "../../gql/queries";
import { SessionContext } from "../../context/sessionContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";
import SpinningEmote from "../../components/SpinningEmotes";
import errorImage from "../../static/images/error.png";
import globale from "../../styles/global";
import { HomeScreenNavigationProps } from "../../types/navigation";
import HeaderProfile from "../../components/headers-icons/HeaderProfile";
import whiteTheme from "../../styles/theme";

const Home = ({ navigation, route }: HomeScreenNavigationProps) => {
    const { loading, error, data, refetch } = useQuery(GET_RECENT_EMOTES);
    const sessionContext = useContext(SessionContext);
    const slideUpdateEmoteAnimation = useRef(new Animated.Value(-10)).current;
    const { newBanner, bannerMessage } = route.params;
    const [showUpdateBanner, setShowUpdateBanner] = useState(newBanner);

    useEffect(() => {
        const getSessionId = async () => {
            const StorageSessionId = await AsyncStorage.getItem("sessionId");
            if (!StorageSessionId) navigation.dispatch(StackActions.replace("Login"));
            else if (!sessionContext.identifier) sessionContext.setContextSessionId(StorageSessionId);
        };
        getSessionId();
        refetch();
        if (showUpdateBanner) {
            setShowUpdateBanner(true);
            Animated.timing(slideUpdateEmoteAnimation, {
                toValue: 0,
                duration: 500, // Adjust as needed
                useNativeDriver: true,
            }).start();
            setTimeout(() => {
                Animated.timing(slideUpdateEmoteAnimation, {
                    toValue: -100,
                    duration: 500, // Adjust as needed
                    useNativeDriver: true,
                }).start(() => setShowUpdateBanner(false));
            }, 3000);
        }
    }, []);

    if (loading) return <SpinningEmote />;
    if (error) {
        console.log(error);
        return (
            <View style={globale.centerContainer}>
                <Image source={errorImage} style={{ width: 200, height: 200 }} />
                <Text>Oops... An error occured, please try again</Text>
            </View>
        );
    }

    const emotes = data.getRecentEmotes;

    return (
        <>
            {showUpdateBanner ? (
                <Animated.View style={[{ transform: [{ translateY: slideUpdateEmoteAnimation }] }]}>
                    <View style={[styles.UpdateBannerContainer]}>
                        <TouchableHighlight onPress={() => navigation.navigate("CollectionEmotesDetail")} underlayColor={"transparent"}>
                            <Text style={styles.notificationText}>{bannerMessage}</Text>
                        </TouchableHighlight>
                    </View>
                </Animated.View>
            ) : (
                <HeaderProfile title={"Home"} />
            )}
            <View style={globale.CreationContainer}>
                <View style={styles.CreationTitleContainer}>
                    <Text style={styles.CreationTitle}>Creation:</Text>
                </View>
                <TouchableHighlight onPress={() => navigation.navigate("Emotes", { screen: "EmotesScreen" })} underlayColor={"transparent"} activeOpacity={0.7}>
                    <Text style={styles.showMoreLink}>Show More</Text>
                </TouchableHighlight>
                <FlatList
                    data={emotes}
                    horizontal={true}
                    keyExtractor={(item) => item.emote_id}
                    renderItem={({ item }) => (
                        <TouchableHighlight
                            onPress={() => {
                                sessionContext.setContextEmoteDetailId(item.emote_id);
                                navigation.navigate("CollectionEmotesDetail");
                            }}
                            underlayColor={"transparent"}
                            activeOpacity={0.7}>
                            <View style={styles.emoteContainer}>
                                <Image source={{ uri: item.src }} style={styles.emote} />
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
            <View style={globale.CreationContainer}>
                <View style={styles.CreationTitleContainer}>
                    <Text style={styles.CreationTitle}>Creation:</Text>
                </View>
                <TouchableHighlight onPress={() => navigation.navigate("Emotes", { screen: "EmotesScreen" })} underlayColor={"transparent"} activeOpacity={0.7}>
                    <Text style={styles.showMoreLink}>Show More</Text>
                </TouchableHighlight>
                <FlatList
                    data={emotes}
                    horizontal={true}
                    keyExtractor={(item) => item.emote_id}
                    renderItem={({ item }) => (
                        <TouchableHighlight
                            onPress={() => {
                                sessionContext.setContextEmoteDetailId(item.emote_id);
                                navigation.navigate("CollectionEmotesDetail");
                            }}
                            underlayColor={"transparent"}
                            activeOpacity={0.7}>
                            <View style={styles.emoteContainer}>
                                <Image source={{ uri: item.src }} style={styles.emote} />
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
            <View style={globale.CreationContainer}>
                <View style={styles.CreationTitleContainer}>
                    <Text style={styles.CreationTitle}>Creation:</Text>
                </View>
                <TouchableHighlight onPress={() => navigation.navigate("Emotes", { screen: "EmotesScreen" })} underlayColor={"transparent"} activeOpacity={0.7}>
                    <Text style={styles.showMoreLink}>Show More</Text>
                </TouchableHighlight>
                <FlatList
                    data={emotes}
                    horizontal={true}
                    keyExtractor={(item) => item.emote_id}
                    renderItem={({ item }) => (
                        <TouchableHighlight
                            onPress={() => {
                                sessionContext.setContextEmoteDetailId(item.emote_id);
                                navigation.navigate("CollectionEmotesDetail");
                            }}
                            underlayColor={"transparent"}
                            activeOpacity={0.7}>
                            <View style={styles.emoteContainer}>
                                <Image source={{ uri: item.src }} style={styles.emote} />
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    creationContainer: {
        marginHorizontal: 10,
        // marginTop: "15%",
    },
    CreationTitleContainer: {},
    CreationTitle: {
        letterSpacing: 2,
        // padding: 5,
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
        borderBottomWidth: 4,
        borderBottomColor: whiteTheme.primaryColor,
        alignSelf: "flex-start",
    },
    emoteContainer: {
        marginHorizontal: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "black",
        padding: 5,
    },
    emote: {
        width: 100,
        height: 100,
    },
    showMoreLink: {
        textAlign: "right",
        color: "#0063cc",
        textDecorationLine: "underline",
        marginBottom: 5,
    },
    UpdateBannerContainer: {
        backgroundColor: whiteTheme.primaryColor,
        borderRadius: 20,
        padding: 16,
        margin: 16,
        // justifyContent: "center",
        alignItems: "center",
    },
    notificationText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 8,
    },
});

export default Home;
