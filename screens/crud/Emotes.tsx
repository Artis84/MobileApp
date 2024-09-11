import React, { useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableHighlight } from "react-native";
import { Searchbar } from "react-native-paper";
import { useQuery } from "@apollo/client";
import { GET_RECENT_EMOTES } from "../../gql/queries";
import SpinningEmote from "../../components/SpinningEmotes";
import globale from "../../styles/global";
import { EmotesStackScreenNavigationProp } from "../../types/navigation";
import errorImage from "../../static/images/error.png";
import HeaderProfile from "../../components/headers-icons/HeaderProfile";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import whiteTheme from "../../styles/theme";

const Emotes = ({ navigation }: EmotesStackScreenNavigationProp<"EmotesScreen">) => {
    const { loading, error, data, refetch } = useQuery(GET_RECENT_EMOTES);
    const [searchInput, setSearchInput] = useState("");

    // Function to handle search input
    const handleSearchInput = (text: string) => {
        setSearchInput(text);
        // You can add logic here to filter emotes based on the search input
    };

    if (loading) return <SpinningEmote />;
    if (error)
        return (
            <View style={globale.centerContainer}>
                <Image source={errorImage} style={{ width: 200, height: 200 }} />
                <Text>Oops... An error occured, please try again.</Text>
            </View>
        );
    const emotes = data.getRecentEmotes;

    return (
        <>
            <HeaderProfile title="Emotes" />
            <View style={globale.rootContainer}>
                <Searchbar placeholder="Search emotes..." onChangeText={handleSearchInput} value={searchInput} style={styles.searchBar} iconColor={whiteTheme.primaryColor} />
                <View style={styles.emotesContainer}>
                    <FlatList
                        data={emotes}
                        renderItem={({ item }) => (
                            <TouchableHighlight onPress={() => navigation.navigate("SearchEmotesDetail", { emoteId: item.emote_id })} underlayColor={"transparent"} activeOpacity={0.7}>
                                <View style={styles.emoteContainer}>
                                    <Image resizeMode="contain" source={{ uri: item.src }} style={styles.emote} />
                                </View>
                            </TouchableHighlight>
                        )}
                        keyExtractor={(item) => item.emote_id}
                        numColumns={3}
                        horizontal={false}
                    />
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        borderBottomWidth: 2,
        borderBottomColor: "lightgrey",
        marginHorizontal: "5%",
    },
    searchBar: {
        backgroundColor: "transparent",
        borderBottomWidth: 2,
        borderBottomColor: "lightgrey",
        padding: 0,
    },
    emotesContainer: {
        marginTop: 30,
    },
    search: {
        backgroundColor: "#f2f2f2",
        borderLeftWidth: 3,
        borderColor: whiteTheme.primaryColor,
    },
    emoteContainer: {
        marginHorizontal: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "black",
        padding: 5,
    },
    emote: {
        width: 100,
        height: 100,
    },
});

export default Emotes;
