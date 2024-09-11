import React, { ReactComponentElement, useContext, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ListRenderItem, TouchableHighlight } from "react-native";
import SadFace from "../../static/images/svgs/sad-face.svg";
import { GET_USER_LIKED_EMOTES } from "../../gql/queries";
import { useQuery } from "@apollo/client";
import SpinningEmote from "../../components/SpinningEmotes";
import globale from "../../styles/global";
import errorImage from "../../static/images/error.png";
import { SessionContext } from "../../context/sessionContext";

const LikedEmotesScreen = ({ userEmotesLiked, navigation }: { userEmotesLiked: any; navigation?: any }) => {
    const sessionContext = useContext(SessionContext);
    if (!userEmotesLiked.length)
        return (
            <View style={styles.noEmotesContainer}>
                <SadFace width={200} height={200} />
                <Text style={styles.noEmotesText}>No emotes found</Text>
            </View>
        );
    const { loading, error, data } = useQuery(GET_USER_LIKED_EMOTES, { variables: { userEmotesLiked } });

    if (loading) return <SpinningEmote />;

    if (error)
        return (
            <View style={globale.centerContainer}>
                <Image source={errorImage} style={{ width: 150, height: 150 }} />
                <Text>Oops... An error occured, please try again.</Text>
            </View>
        );
    const emotesUserLiked = data.getUserLikedEmotes;

    return (
        <View style={styles.container}>
            <FlatList
                data={emotesUserLiked}
                numColumns={3}
                contentContainerStyle={styles.emoteList}
                keyExtractor={(item) => item.emote_id}
                renderItem={({ item }) => (
                    <TouchableHighlight
                        onPress={() => {
                            sessionContext.setContextEmoteDetailId(item.emote_id);
                            navigation.navigate("CollectionEmotesDetail");
                        }}
                        underlayColor={"transparent"}
                        activeOpacity={0.7}>
                        <Image source={{ uri: item.src }} style={styles.emoteImage} />
                    </TouchableHighlight>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    emoteList: {
        flexDirection: "row",
        // flexWrap: "wrap",
    },
    emoteImage: {
        width: 100,
        height: 100,
        margin: 5,
    },
    noEmotesContainer: {
        borderColor: "black",
        // justifyContent: "center",
        alignItems: "center",
    },
    noEmotesText: {
        fontWeight: "bold",
        fontSize: 20,
        margin: 20,
    },
});

export default LikedEmotesScreen;
