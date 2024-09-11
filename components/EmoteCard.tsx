import React, { useEffect, useState, useContext } from "react";
import { View, Image, StyleSheet, Animated, Share, Modal, TouchableWithoutFeedback, TouchableHighlight } from "react-native";
import { Card, Divider, Text, TouchableRipple } from "react-native-paper";
import globale from "../styles/global";
import { useQuery } from "@apollo/client";
import { GET_DETAILES_EMOTE } from "../gql/queries";
import SpinningEmote from "../components/SpinningEmotes";
import errorImage from "../static/images/error.png";
import EmoteCardModel from "./models/EmoteCardModel";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import whiteTheme from "../styles/theme";
import { SessionContext } from "../context/sessionContext";
import InfoPopup from "./InfoPopup";
import { CommonActions, useNavigation } from "@react-navigation/native";

const EmoteCard = ({ emoteId }: Emote) => {
    const sessionContext = useContext(SessionContext);
    const navigation = useNavigation();
    const sessionId = sessionContext.identifier;
    const { loading, error, data, refetch } = useQuery(GET_DETAILES_EMOTE, { variables: { emoteId, sessionId } });
    const [liked, setLiked] = useState(false);
    const [userLiked, setUserLiked] = useState(false);
    const [networkError, setNetworkError] = useState("");
    const [serverError, setServerError] = useState("");
    const [Scale] = useState(new Animated.Value(0));
    const [RotateY] = useState(new Animated.Value(0));
    const [optionsMenu, setOptionsMenu] = useState(false);
    const [username, setUsername] = useState("");

    const EmoteCard = new EmoteCardModel();

    const showOptionsMenu = () => setOptionsMenu(true);

    const hideOptionsMenu = () => setOptionsMenu(false);

    const handleEditEmoteButton = async () => {
        setServerError("");
        try {
            await EmoteCard.checkValidOwner(sessionId, emoteId!);
            setOptionsMenu(false);
            navigation.dispatch(
                CommonActions.navigate({
                    name: "Edit",
                    params: { emoteId: emoteId },
                })
            );
        } catch (error) {
            if (error instanceof Error && error.message === "Aborted") setNetworkError("Cannot comunicate with the server. Check your internet connection and try again.");
            else setServerError("An error occured, please try again.");
        }
    };

    const handleDeleteEmoteButton = async () => {
        setServerError("");
        try {
            await EmoteCard.deletingEmote(sessionId, emoteId!);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "HomeScreen", params: { newBanner: true, bannerMessage: "The emote has been successfully deleted" } }],
                })
            );
        } catch (error) {
            if (error instanceof Error && error.message === "Aborted") setNetworkError("Cannot comunicate with the server. Check your internet connection and try again.");
            else setServerError("Cannot delete the emote, please try again.");
        }
    };

    const getDate = () => {
        const formatDate = EmoteCard.getFormateDate(emote.create_at!);
        return <Text style={styles.date}>{formatDate}</Text>;
    };

    const handleLikeButton = async () => {
        setNetworkError("");
        try {
            const isEmoteLikeble = await EmoteCard.addEmoteLike(emoteId!, sessionId);
            if (!emote.user_liked) {
                if (!isEmoteLikeble) {
                    emote.likes!--;
                    setLiked(false);
                } else {
                    emote.likes!++;
                    setLiked(true);
                }
            } else {
                if (!isEmoteLikeble) {
                    emote.likes!--;
                    setUserLiked(false);
                } else {
                    emote.likes!++;
                    setUserLiked(true);
                }
            }
        } catch (_error) {
            setNetworkError("Cannot comunicate with the server. Check your internet connection and try again.");
        }
    };

    const handleShareButton = async (url: string) => {
        try {
            const content = {
                message: url,
            };

            const result = await Share.share(content);

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared successfully
                    console.log(`Shared via ${result.activityType}`);
                } else {
                    // Shared successfully without specifying activity type
                    console.log("Shared successfully");
                }
            } else if (result.action === Share.dismissedAction) {
                // Sharing dismissed by user
                console.log("Sharing dismissed");
            }
        } catch (error) {
            // Handle error if sharing fails
            if (error instanceof Error) console.error("Error sharing:", error.message);
        }
    };

    useEffect(() => {
        Animated.sequence([
            Animated.timing(Scale, {
                toValue: 1.5,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(RotateY, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(RotateY, {
                toValue: 0,
                duration: 0,
                useNativeDriver: false,
            }),
            Animated.timing(Scale, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
            }),
        ]).start();
    }, [liked]);

    const RotateYValues = RotateY.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    useEffect(() => {
        if (data) {
            refetch();
            if (emote.user_liked) setUserLiked(true);
            setUsername(usernames.username[0]);
        }
    }, [data]);

    if (loading) return <SpinningEmote />;

    if (error)
        return (
            <View style={globale.centerContainer}>
                <Image source={errorImage} style={{ width: 150, height: 150 }} />
                <Text>Oops... An error occured, please try again.</Text>
            </View>
        );

    const emote: Emote = data.getDetailesEmote[0];
    const usernames: User = data.getDetailesEmote[1];
    return (
        <>
            <View style={styles.CardContainer}>
                <Card>
                    <View style={styles.optionsIconContainer}>
                        <View style={styles.optionsIcon}>
                            <TouchableRipple onPress={showOptionsMenu} rippleColor="lightgrey" style={globale.rippleEffect}>
                                <MaterialCommunityIcons name="dots-vertical" color={"black"} size={22} />
                            </TouchableRipple>
                        </View>
                    </View>
                    <Card.Content>
                        <Text variant="headlineLarge" style={styles.name}>
                            {emote.name}
                        </Text>
                        <Text variant="labelLarge" style={styles.author}>
                            {emote.author}
                        </Text>
                        <Text style={styles.rightCard}>{getDate()}</Text>
                    </Card.Content>
                    <Card.Cover source={{ uri: emote.src }} style={styles.emote} />
                    <View style={styles.actionContainer}>
                        <Card.Actions>
                            <Text variant="labelSmall">{emote.likes}</Text>
                            {userLiked && emote.user_liked && <FontAwesome name="heart" color={"#dc143c"} size={22} onPress={handleLikeButton} />}

                            {!userLiked && emote.user_liked && <FontAwesome name="heart-o" color={whiteTheme.secondaryColor} size={22} onPress={handleLikeButton} />}

                            {liked && !emote.user_liked && (
                                <Animated.View style={[{ transform: [{ scale: Scale }, { rotateY: RotateYValues }] }]}>
                                    <FontAwesome name="heart" color={"#dc143c"} size={22} onPress={handleLikeButton} />
                                </Animated.View>
                            )}

                            {!liked && !emote.user_liked && <FontAwesome name="heart-o" color={whiteTheme.secondaryColor} size={22} onPress={handleLikeButton} />}

                            <FontAwesome5 name="share" color={whiteTheme.secondaryColor} size={22} onPress={() => handleShareButton(emote.src!)} />
                        </Card.Actions>
                        <View style={styles.iconLeft}>
                            <MaterialCommunityIcons name="comment-processing" color={whiteTheme.secondaryColor} size={22} onPress={() => console.log("hit")} />
                        </View>
                    </View>
                    <Modal visible={optionsMenu} transparent animationType="slide">
                        <TouchableWithoutFeedback onPress={hideOptionsMenu}>
                            <View style={styles.overlay} />
                        </TouchableWithoutFeedback>
                        <View style={styles.menu}>
                            {username === emote.author && (
                                <TouchableRipple style={styles.menuItem} onPress={handleEditEmoteButton}>
                                    <Text style={styles.editEmote}>Edit</Text>
                                </TouchableRipple>
                            )}
                            <TouchableRipple style={styles.menuItem} onPress={() => console.log("edit")}>
                                <Text style={styles.copyEmote}>Copy emote link</Text>
                            </TouchableRipple>
                            {username === emote.author && (
                                <TouchableRipple style={[styles.menuItem, styles.deleteItem]} onPress={handleDeleteEmoteButton}>
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableRipple>
                            )}
                        </View>
                    </Modal>
                </Card>
            </View>
            {serverError && <InfoPopup content={serverError} />}
            {networkError && <InfoPopup content={networkError} />}
        </>
    );
};

const styles = StyleSheet.create({
    CardContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: "5%",
    },
    actionContainer: {
        flexDirection: "row-reverse",
    },
    optionsIconContainer: {
        alignItems: "flex-end",
    },
    optionsIcon: {
        borderRadius: 50,
        overflow: "hidden",
        margin: 5,
    },
    emote: {
        width: 400,
        height: 400,
    },
    name: {
        fontWeight: "bold",
        color: whiteTheme.primaryColor,
    },
    author: {
        textDecorationLine: "underline",
    },
    rightCard: {
        textAlign: "right",
    },
    date: {
        color: "black",
        fontStyle: "italic",
        padding: 10,
    },
    iconLeft: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 5,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    menu: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 5,
    },
    menuItem: {
        padding: 15,
        alignItems: "center",
    },
    deleteItem: {
        backgroundColor: "red",
    },
    deleteText: {
        color: "white",
    },
    editEmote: {
        fontWeight: "bold",
    },
    copyEmote: {
        fontWeight: "bold",
    },
});

export default EmoteCard;
