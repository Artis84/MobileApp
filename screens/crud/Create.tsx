import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Button, TouchableHighlight, Image, StyleSheet } from "react-native";
import CreateModel from "../../models/crud/CreateModel";
import StatusMark from "../../components/StatusMark";
import Spinner from "../../components/Spinner";
import { SessionContext } from "../../context/sessionContext";
import DocumentPicker, { DocumentPickerResponse } from "react-native-document-picker";
import InfoModal from "../../components/InfoPopup";
import globale from "../../styles/global";
import whiteTheme from "../../styles/theme";
import HeaderTitle from "../../components/headers-icons/HeaderTitle";

const Create = () => {
    const [name, setName] = useState("");
    const [emote, setEmote] = useState<DocumentPickerResponse>({} as DocumentPickerResponse);
    const [tag, setTag] = useState("");
    const [tagArray, setTagArray] = useState<string[]>([]);
    const [showTagPlaceholder, setShowTagPlaceholder] = useState(true);
    const [emoteError, setEmoteError] = useState("");
    const [nameError, setNameError] = useState("");
    const [tagError, setTagError] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [pendingName, setPendingName] = useState(false);
    const [pendingTag, setPendingTag] = useState(false);
    const [showSucessUploadPopUp, setShowSucessUploadPopUp] = useState(false);
    const sessionContext = useContext(SessionContext);

    const create = new CreateModel();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const emoteData: any = emote;
            const tags: any = tagArray;

            const formData = new FormData();
            formData.append("sessionId", sessionContext.identifier);
            formData.append("name", name);
            formData.append("emote", emoteData);
            formData.append("tags", tags);

            const controller = new AbortController();
            const timeout = 10000;

            const timeoutId = setTimeout(() => {
                controller.abort();
                throw new Error("TIME OUT IS OVER!");
            }, timeout);

            const response = await fetch("http://192.168.1.51:3000/create", {
                signal: controller.signal,
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });
            setLoading(false);
            clearTimeout(timeoutId);

            if (response.ok) {
                setShowSucessUploadPopUp(true);
            } else {
                clearTimeout(timeoutId);
                throw new Error();
            }
        } catch (error) {
            setLoading(false);
            setStatus("Upload failed. Please try again.");
        }
    };

    const handleNameChange = (name: string) => {
        if (!create.validateName(name)) setNameError("The emote name must contain only letters and numbers");
        else checkNameUniqueness(name);
    };
    const checkNameUniqueness = async (name: string) => {
        try {
            setPendingName(true);
            const usernameUniqueness = await create.checkUniqueness(name, null);
            setPendingName(false);
            if (usernameUniqueness) {
                setNameError("The username is already used");
            } else {
                setNameError("");
                setName(name);
            }
        } catch (error) {
            setPendingName(false);
            setNameError("The username cannot be verified due to an error");
        }
    };

    const handleTagsChange = (newTag: string) => {
        setTag(newTag);
        if (!create.validateTag(newTag) && newTag.length) setTagError("Each tag must only contain letters and numbers");
        else setTagError("");

        const lastChar = newTag.charAt(newTag.length - 1);
        if (lastChar === "," && newTag !== ",") {
            const tag = newTag.slice(0, -1).trim();
            if (tag.length === 1) {
                setTagError("Each tag need to contain more than 1 character");
            } else {
                setTagArray([...tagArray, tag]);
                setShowTagPlaceholder(false);
                setTagError("");
                setTag("");
            }
        }
    };

    // const checkTagUniqueness = async (tag: string) => {
    //     try {
    //         setPendingTag(true);
    //         const tagUniqueness = await createClientSide.checkUniqueness(null, tag);
    //         setPendingTag(false);
    //         if (tagUniqueness) {
    //             setTagError("The username is already used");
    //         } else {
    //             setTagArray([...tagArray, tag]);
    //             setShowTagPlaceholder(false);
    //             setTagError("");
    //             setTag("");
    //         }
    //     } catch (error) {
    //         setPendingTag(false);
    //         setTagError("The username cannot be verified due to an error");
    //     }
    // };

    const handleTagDeletion = (index: number) => {
        const newTagArray = [...tagArray];
        newTagArray.splice(index, 1);
        setTagArray(newTagArray);
    };

    const handleEmoteUpload = async () => {
        try {
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.images], // You can specify the file types you want to allow
            });
            const emoteFile = file[0];
            const maxFileSize = 5 * 1024 * 1024;
            Image.getSize(emoteFile.uri, (width, height) => {
                if (width !== 100 && height !== 100) {
                    setEmote({} as DocumentPickerResponse);
                    setEmoteError("Emote dimensions exceeds the maximum allowed 100x100 .");
                }
            });
            if (emoteFile.size! > maxFileSize) {
                setEmote({} as DocumentPickerResponse);
                setEmoteError("Emote size exceeds the maximum allowed size.");
            } else {
                setEmote(emoteFile);
                setEmoteError("");
            }
            // });
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.log("Canceled ", error);
            } else {
                console.log(error);
                setStatus("An error occured during upload, please try again");
            }
        }
    };

    useEffect(() => {
        if (!tagArray.length) setShowTagPlaceholder(true);
    }, [tagArray, tag]);

    return (
        <>
            {loading && <Spinner />}
            <HeaderTitle title="Create" />
            <View style={styles.container}>
                <View style={[globale.inputContainer, nameError ? globale.errorInput : null]}>
                    <TextInput placeholder="Name" autoCapitalize="none" maxLength={20} onChangeText={handleNameChange} />
                    <StatusMark valid={nameError.length === 0 && name.length > 0 && !pendingName} invalid={nameError.length > 0 && !pendingName} pending={pendingName} />
                </View>
                {nameError ? <Text style={globale.errorText}>{nameError}</Text> : null}

                <View style={[globale.inputContainer, tagError ? globale.errorInput : null]}>
                    <TextInput placeholder="Enter tags seperate with a comma" value={tag} maxLength={20} onChangeText={handleTagsChange} multiline />
                    <StatusMark valid={tagError.length === 0 && tag.length > 0 && !pendingTag} invalid={tagError.length > 0 && !pendingTag} pending={pendingTag} />
                </View>
                <View style={[styles.tagsContainer, { height: Math.max(60, tagArray.length * 7) }]}>
                    {showTagPlaceholder && <Text style={styles.tagPlaceholder}>tag</Text>}
                    {tagArray.map((tag, index) => (
                        <TouchableHighlight key={index} onPress={() => handleTagDeletion(index)} style={styles.tagContainer} underlayColor="#66b0ff">
                            <Text style={styles.tagText}>{tag}</Text>
                        </TouchableHighlight>
                    ))}
                </View>
                {tagError ? <Text style={globale.errorText}>{tagError}</Text> : null}
                <View style={styles.uploadContainer}>
                    <Button title="Upload emote" onPress={handleEmoteUpload} />
                    {emote.uri && (
                        <View style={styles.emoteImageContainer}>
                            <Image resizeMode="contain" source={{ uri: emote.uri }} style={styles.uploadedImage} />
                        </View>
                    )}
                </View>
                {emoteError ? <Text style={globale.errorText}>{emoteError}</Text> : null}
                <View style={styles.submitButton}>
                    <Button title="Submit" onPress={handleSubmit} disabled={!name || !tagArray.length || !emote.uri} />
                </View>
                {status ? <Text style={globale.errorText}>{status}</Text> : null}
                {showSucessUploadPopUp && <InfoModal content="The emote has been upload successfully 🎉" popupAction={"Root"} />}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: "20%",
        alignItems: "center",
        gap: 20,
        // marginHorizontal: 10,
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
    },
    tagsContainer: {
        width: "80%",
        minHeight: 40,
        padding: 10,
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: "row",
        flexWrap: "wrap",
        borderStyle: "dashed",
    },
    tagContainer: {
        backgroundColor: whiteTheme.primaryColor,
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8,
        margin: 2,
    },
    tagPlaceholder: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8,
        margin: 2,
    },
    tagText: {
        color: "black",
    },
    uploadContainer: {
        flexDirection: "row",
        alignItems: "center", // Center vertically
        gap: 20,
    },
    uploadedImage: {
        width: 50,
        height: 50,
    },
    emoteImageContainer: {
        borderWidth: 1,
        borderColor: "lightgrey",
        // backgroundColor: "white",
        padding: 4,
    },
    emotePlaceholderContainer: {
        borderWidth: 1,
        borderColor: "lightgrey",
        borderStyle: "dashed",
        padding: 2,
    },
    submitButton: {
        width: "20%",
    },
});

export default Create;
