import React, { useState, useEffect } from "react";
import { StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const StatusMark = ({ valid, invalid }) => {
    const [sizeCheckmark] = useState(new Animated.Value(0));
    const [sizeErrorMark] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(sizeCheckmark, {
                toValue: valid ? 1 : 0,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(sizeErrorMark, {
                toValue: invalid ? 1 : 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }, [valid, invalid]);

    const scaleCheckmark = sizeCheckmark.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const scaleErrorMark = sizeErrorMark.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <>
            <Animated.View style={[styles.checkbox, { transform: [{ scale: scaleCheckmark }] }]}>
                <Icon name="check" size={18} color="green" />
            </Animated.View>
            <Animated.View style={[styles.checkbox, { transform: [{ scale: scaleErrorMark }] }]}>
                <Icon name="times" size={18} color="red" />
            </Animated.View>
        </>
    );
};
const styles = StyleSheet.create({
    checkbox: {
        position: "absolute",
        right: 8,
        top: "25%",
        transform: [{ translateY: -8 }],
    },
});

export default StatusMark;
