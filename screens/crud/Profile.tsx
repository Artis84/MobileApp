import React, { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../context/sessionContext";
import InfoModal from "../../components/InfoPopup";
import ProfileModel from "../../models/crud/ProfileModel";
import globale from "../../styles/global";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, TouchableWithoutFeedback, TouchableHighlight } from "react-native";
import CreatedEmotesScreen from "./CreatedEmotesScreen"; // Component for created emotes
import LikedEmotesScreen from "./LikedEmotesScreen"; // Component for liked emotes
import HeaderBack from "../../components/headers-icons/HeaderBack";
import HeaderSettings from "../../components/headers-icons/HeaderSettings";
import { StackActions, useNavigation } from "@react-navigation/native";
import whiteTheme from "../../styles/theme";
import errorImage from "../../static/images/error.png";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../gql/queries";
import SpinningEmote from "../../components/SpinningEmotes";

const profileModel = new ProfileModel();

const ProfileScreen = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [showErrorLogout, setShowErrorLogout] = useState(false);
    const [showNetworkError, setShowNetworkError] = useState(false);
    // const [userProfile, setuserProfile] = useState([]);
    const sessionContext = useContext(SessionContext);
    const sessionId = sessionContext.identifier;
    const { loading, error, data, refetch } = useQuery(GET_USER_PROFILE, { variables: { sessionId } });
    const navigation = useNavigation();

    const showSettingsModal = (showSettings: boolean) => {
        setShowSettings(showSettings);
    };

    const hideSettingsModal = () => setShowSettings(false);

    const [selectedCategory, setSelectedCategory] = useState("created");

    const handleLogout = async () => {
        try {
            const removeCurrentSession = await profileModel.removeCurrentSession(sessionContext.identifier);
            if (!removeCurrentSession) setShowErrorLogout(true);
            else {
                sessionContext.removeStorage("sessionId");
                sessionContext.setContextSessionId("");
                navigation.dispatch(StackActions.replace("Login"));
            }
        } catch (error) {
            setShowNetworkError(true);
        }
    };

    const getInitial = (name: string) => name.charAt(0).toUpperCase();

    useEffect(() => {
        if (data) {
            refetch();
            // setuserProfile(data.getUserProfile);
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
    // setuserProfile(data.getUserProfile);
    const userProfile: UserProfile[] = data.getUserProfile;

    return (
        <>
            <HeaderSettings showSettingsModal={showSettingsModal}></HeaderSettings>
            <HeaderBack parent="HomeScreen" />
            <View style={styles.container}>
                {/* Profile Picture (Initials) */}
                <View style={styles.profilePictureContainer}>
                    <View style={styles.profilePicture}>
                        <Text style={styles.initials}>{getInitial(userProfile[0].username[0])}</Text>
                    </View>
                </View>

                {/* Username */}
                <Text style={styles.username}>{userProfile[0].username[0]}</Text>

                {/* Menu for switching between Created and Liked categories */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={[styles.menuItem, selectedCategory === "created" && styles.activeMenuItem]} onPress={() => setSelectedCategory("created")}>
                        <Text style={[styles.menuText, selectedCategory === "created" && styles.activeMenuText]}>Created</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, selectedCategory === "liked" && styles.activeMenuItem]} onPress={() => setSelectedCategory("liked")}>
                        <Text style={[styles.menuText, selectedCategory === "liked" && styles.activeMenuText]}>Liked</Text>
                    </TouchableOpacity>
                </View>

                {/* Render the selected category */}
                <View style={styles.contentContainer}>
                    {selectedCategory === "created" ? <CreatedEmotesScreen userEmotes={userProfile} /> : <LikedEmotesScreen userEmotesLiked={userProfile[0].emotes_liked!} />}
                </View>
                <Modal visible={showSettings} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={hideSettingsModal}>
                        <View style={styles.overlay} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modal}>
                        <TouchableHighlight style={styles.modalItem} underlayColor={"lightgrey"} onPress={handleLogout}>
                            <Text style={styles.modalTextItem}>logout</Text>
                        </TouchableHighlight>
                    </View>
                </Modal>
            </View>
            {showErrorLogout && <InfoModal content="An error occured during logout." />}
            {showNetworkError && <InfoModal content="Cannot reach the server, check your internet connection." />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
    },
    profilePictureContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: whiteTheme.primaryColor, // Example background color for initials
        justifyContent: "center",
        alignItems: "center",
    },
    initials: {
        fontSize: 50,
        color: "#fff",
        fontWeight: "bold",
    },
    username: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    menuContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 20,
    },
    menuItem: {
        marginHorizontal: 20,
        paddingBottom: 5,
    },
    menuText: {
        fontSize: 18,
        color: "gray",
    },
    activeMenuItem: {
        borderBottomWidth: 2,
        borderBottomColor: whiteTheme.primaryColor,
    },
    activeMenuText: {
        color: whiteTheme.secondaryColor,
        fontWeight: "bold",
    },
    contentContainer: {
        flex: 1,
        padding: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalItem: {
        padding: 15,
        alignItems: "center",
    },
    modal: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 5,
    },
    modalTextItem: {
        fontWeight: "bold",
    },
});

export default ProfileScreen;
