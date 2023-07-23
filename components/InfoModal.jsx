import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, Button } from "react-native";

const InfoModal = ({ content }) => {
    const [modalVisible, setModalVisible] = useState(true);

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <Modal visible={modalVisible} transparent animationType="fade">
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

export default InfoModal;
