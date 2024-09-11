import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { EmotesStackScreenNavigationProp } from "../../types/navigation";
import HeaderBack from "../../components/headers-icons/HeaderBack";
import EmoteCard from "../../components/EmoteCard";
import { SessionContext } from "../../context/sessionContext";

const SearchEmotesDetail = ({ navigation }: EmotesStackScreenNavigationProp<"SearchEmotesDetail">) => {
    const sessionContext = useContext(SessionContext);

    return (
        <>
            <HeaderBack parent="EmotesScreen" />
            <EmoteCard emoteId={sessionContext.emoteDetailIdentifier} />
        </>
    );
};

const styles = StyleSheet.create({});

export default SearchEmotesDetail;
