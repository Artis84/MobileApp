import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface InfoPopupProps {
    content?: string;
    popupAction?: string;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ content, popupAction }) => {
    const navigation = useNavigation<any>();
    const [modalVisibility, setModalVisibility] = useState(true);

    const handleCloseModal = () => {
        if (popupAction) navigation.replace(popupAction);
        else setModalVisibility(false);
    };

    return (
        <Modal visible={modalVisibility} transparent animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>{content}</Text>
                    <Button title="OK" onPress={handleCloseModal} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
    },
});

export default InfoPopup;
