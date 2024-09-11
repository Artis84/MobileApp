import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { CollectionEmotesNavigationProp } from "../../types/navigation";
import HeaderBack from "../../components/headers-icons/HeaderBack";
import EmoteCard from "../../components/EmoteCard";
import { SessionContext } from "../../context/sessionContext";

const CollectionEmotesDetail = ({ navigation }: CollectionEmotesNavigationProp<"CollectionEmotesDetailScreen">) => {
    const sessionContext = useContext(SessionContext);

    return (
        <>
            <HeaderBack parent="HomeScreen" />
            <EmoteCard emoteId={sessionContext.emoteDetailIdentifier} />
        </>
    );
};

const styles = StyleSheet.create({});

export default CollectionEmotesDetail;
