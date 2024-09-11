import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Animated, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import whiteTheme from "../styles/theme";

interface StatusMarkProps {
    valid?: boolean;
    invalid?: boolean;
    pending?: boolean;
}

const StatusMark: React.FC<StatusMarkProps> = ({ valid, invalid, pending }) => {
    const [sizeCheckmark] = useState(new Animated.Value(0));
    const [sizeErrorMark] = useState(new Animated.Value(0));
    const [sizePendingMark] = useState(new Animated.Value(0));

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
            Animated.timing(sizePendingMark, {
                toValue: pending ? 1 : 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
        // previousDependencies.current = currentDependencies;
    }, [valid, invalid, pending]);

    const scaleCheckmark = sizeCheckmark.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const scaleErrorMark = sizeErrorMark.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const scalePendingMark = sizePendingMark.interpolate({
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
            <Animated.View style={[styles.checkbox, { transform: [{ scale: scalePendingMark }] }]}>
                <ActivityIndicator size={18} color={whiteTheme.primaryColor} />
            </Animated.View>
        </>
    );
};
const styles = StyleSheet.create({
    checkbox: {
        position: "absolute",
        right: 8,
        top: "20%",
    },
});

export default StatusMark;
