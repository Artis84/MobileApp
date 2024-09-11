import React, { useEffect, useState, useContext } from "react";
import { View, Image, StyleSheet, Button, TextInput, Keyboard } from "react-native";
import { Card, Text, TouchableRipple } from "react-native-paper";
import globale from "../../styles/global";
import { useQuery } from "@apollo/client";
import { GET_DETAILES_EMOTE } from "../../gql/queries";
import SpinningEmote from "../../components/SpinningEmotes";
import errorImage from "../../static/images/error.png";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import whiteTheme from "../../styles/theme";
import { SessionContext } from "../../context/sessionContext";
import InfoPopup from "../../components/InfoPopup";
import EditEmote from "../../models/crud/EditEmote";
import DocumentPicker, { DocumentPickerResponse } from "react-native-document-picker";
import Spinner from "../../components/Spinner";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { CollectionEmotesNavigationProp } from "../../types/navigation";
import HeaderBack from "../../components/headers-icons/HeaderBack";

const Edit = ({ route }: CollectionEmotesNavigationProp<"Edit">) => {
    const [loadingUpload, setLoadingUpload] = useState(false);
    const { emoteId } = route.params;
    const sessionContext = useContext(SessionContext);
    const sessionId = sessionContext.identifier;
    const { loading, error, data } = useQuery(GET_DETAILES_EMOTE, { variables: { emoteId, sessionId } });
    const [networkError, setNetworkError] = useState("");
    const [EditingEmoteName, setEditingEmoteName] = useState(false);
    const [editedEmoteName, setEditedEmoteName] = useState("");
    const [editedEmoteNameError, setEditedEmoteNameError] = useState("");
    const [editedEmote, setEditedEmote] = useState<DocumentPickerResponse>({} as DocumentPickerResponse);
    const [editedEmoteError, setEditedEmoteError] = useState("");
    const navigation = useNavigation();

    const editEmote = new EditEmote();

    const handleEditNameChange = (Emotename: string) => {
        setEditedEmoteNameError("");
        setEditedEmoteName(Emotename);
    };

    const handleEditEmote = async () => {
        try {
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            const emoteFile = file[0];
            const maxFileSize = 5 * 1024 * 1024;
            Image.getSize(emoteFile.uri, (width, height) => {
                if (width !== 100 && height !== 100) {
                    setEditedEmote({} as DocumentPickerResponse);
                    setEditedEmoteError("Emote dimensions exceeds the maximum allowed 100x100 .");
                }
            });
            if (emoteFile.size! > maxFileSize) {
                setEditedEmote({} as DocumentPickerResponse);
                setEditedEmoteError("Emote size exceeds the maximum allowed size.");
            } else {
                setEditedEmote(emoteFile);
                setEditedEmoteError("");
            }
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.log("Canceled ", error);
            } else {
                console.log(error);
                setEditedEmoteError("An error occured during upload, please try again");
            }
        }
    };

    const handleSubmit = async () => {
        setNetworkError("");
        setEditedEmoteNameError("");
        try {
            setLoadingUpload!(true);
            // CHECK IN THE FIRST PLACE IF THE USER HAS CHANGED THE EMOTES AND THE NAME ELSE IF CHECK ONLY THE NAME ELSE THE EMOTE
            if (editedEmoteName !== originalEmote.name) {
                const isEmoteNameNotUnique = await editEmote.checkEmoteNameUniqueness(editedEmoteName);
                if (isEmoteNameNotUnique) {
                    setEditedEmoteNameError("The username is already used");
                    setLoadingUpload!(false);
                    return;
                }
                if (editedEmote.uri) await editEmote.updateEmote(emoteId!, editedEmoteName, editedEmote);
                else await editEmote.updateEmoteName(emoteId!, editedEmoteName);
            } else await editEmote.updateEmoteBinaries(emoteId!, editedEmote);

            setLoadingUpload!(false);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "HomeScreen", params: { newBanner: true, bannerMessage: "The emote has been updated! Press to show" } }],
                })
            );
        } catch (error) {
            setLoadingUpload!(false);
            if (error instanceof Error && error.message === "Aborted") setNetworkError("Cannot comunicate with the server. Check your internet connection and try again.");
            else setNetworkError("Cannot update the emote, please try again.");
        }
    };

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
            setEditingEmoteName(false);
        });

        setEditedEmoteName(originalEmote.name!);

        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    if (loading) return <SpinningEmote />;

    if (error)
        return (
            <View style={globale.centerContainer}>
                <Image source={errorImage} style={{ width: 150, height: 150 }} />
                <Text>Oops... An error occured, please try again.</Text>
            </View>
        );
    const originalEmote: Emote = data.getDetailesEmote[0];

    return (
        <>
            {loadingUpload && <Spinner />}
            <HeaderBack parent="CollectionEmotesDetailScreen" />
            <View style={styles.CardContainer}>
                <Card>
                    <Card.Content>
                        {EditingEmoteName ? (
                            <View>
                                <TextInput value={editedEmoteName} onChangeText={handleEditNameChange} autoFocus onBlur={() => setEditingEmoteName(false)} style={styles.editInput} />
                            </View>
                        ) : (
                            <View style={styles.nameContainer}>
                                {editedEmoteName ? (
                                    <Text variant="headlineLarge" style={styles.name}>
                                        {editedEmoteName}
                                    </Text>
                                ) : (
                                    <Text variant="headlineLarge" style={styles.name}>
                                        {originalEmote.name}
                                    </Text>
                                )}
                                <View style={styles.pencilIconContainer}>
                                    <View style={styles.namePencilIcon}>
                                        <TouchableRipple onPress={() => setEditingEmoteName(true)} rippleColor="lightgrey" style={globale.rippleEffect}>
                                            <MaterialCommunityIcons name="pencil" color={whiteTheme.secondaryColor} size={22} />
                                        </TouchableRipple>
                                    </View>
                                </View>
                            </View>
                        )}
                    </Card.Content>
                    <View style={styles.editEmoteIconContainer}>
                        {editedEmote.uri ? <Card.Cover source={{ uri: editedEmote.uri }} style={styles.emote} /> : <Card.Cover source={{ uri: originalEmote.src }} style={styles.emote} />}

                        <View style={styles.emotePencilIconContainer}>
                            <View style={styles.emotePencilIcon}>
                                <TouchableRipple onPress={handleEditEmote} rippleColor="grey" style={styles.rippleEffect}>
                                    <MaterialCommunityIcons name="pencil" color={whiteTheme.secondaryColor} size={44} />
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>
                </Card>
                <View style={styles.button}>
                    <Button title="Update" onPress={handleSubmit} disabled={editedEmoteName === originalEmote.name && Object.keys(editedEmote).length === 0} />
                </View>
            </View>
            {editedEmoteNameError && <InfoPopup content={editedEmoteNameError} />}
            {editedEmoteError && <InfoPopup content={editedEmoteError} />}
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
    emote: {
        width: 400,
        height: 400,
    },
    nameContainer: {
        flexDirection: "row",
        gap: 5,
    },
    EditnameErrorContainer: {
        // borderWidth: 1,
        // margin: 10,
    },
    name: {
        fontWeight: "bold",
        color: whiteTheme.primaryColor,
    },
    editEmoteIconContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    pencilIconContainer: {
        justifyContent: "center",
    },
    namePencilIcon: {
        position: "absolute",
        borderRadius: 50,
        overflow: "hidden",
    },
    emotePencilIconContainer: {
        overflow: "hidden",
        position: "absolute",
        borderRadius: 50,
    },
    emotePencilIcon: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    rippleEffect: {
        padding: 20,
    },
    editInput: {
        fontSize: 30,
        fontWeight: "bold",
        color: whiteTheme.primaryColor,
        textDecorationLine: "none",
    },
    button: {
        margin: 20,
    },
});

export default Edit;
