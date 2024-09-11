import React, { useContext } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableHighlight } from "react-native";
import SadFace from "../../static/images/svgs/sad-face.svg";
import { SessionContext } from "../../context/sessionContext";
import { CommonActions, useNavigation } from "@react-navigation/native";

const CreatedEmotesScreen = ({ userEmotes }: { userEmotes: any }) => {
    const sessionContext = useContext(SessionContext);
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            {userEmotes[1] ? (
                // <FlatList
                //     data={userEmotes}
                //     keyExtractor={(item) => item.emote_id}
                //     numColumns={3}
                //     renderItem={({ item, index }): any => {
                //         if (index > 0) return <Image source={{ uri: item.src }} style={styles.emoteImage} />;
                //     }}
                // />
                <FlatList
                    data={userEmotes}
                    numColumns={3}
                    contentContainerStyle={styles.emoteList}
                    keyExtractor={(item) => item.emote_id}
                    renderItem={({ item, index }): any => {
                        if (index > 0) {
                            return (
                                <TouchableHighlight
                                    onPress={() => {
                                        sessionContext.setContextEmoteDetailId(item.emote_id);
                                        navigation.dispatch(
                                            CommonActions.navigate({
                                                name: "CollectionEmotesDetail",
                                            })
                                        );
                                    }}
                                    underlayColor={"transparent"}
                                    activeOpacity={0.7}>
                                    <Image source={{ uri: item.src }} style={styles.emoteImage} />
                                </TouchableHighlight>
                            );
                        }
                    }}
                />
            ) : (
                <View style={styles.noEmotesContainer}>
                    <SadFace width={200} height={200} />
                    <Text style={styles.noEmotesText}>No emotes found</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    emoteList: {
        flexDirection: "row",
        // flexWrap: "wrap",
    },
    container: {
        flex: 1,
        padding: 10,
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

export default CreatedEmotesScreen;
