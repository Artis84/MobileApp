import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

const Spinner = () => {
    const animation = useRef(new Animated.Value(0)).current;
    const containerWidth = Dimensions.get("window").width;

    const lineColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgb(0, 77, 128)", "rgb(0, 153, 255)"],
    });

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animation, {
                        toValue: 1,
                        duration: 1200, // Adjust the duration as needed
                        useNativeDriver: false,
                    }),
                    Animated.timing(animation, {
                        toValue: 0,
                        duration: 1200, // Adjust the duration as needed
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        };

        startAnimation();
    }, [animation]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.line,
                    {
                        backgroundColor: lineColor,
                        width: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, containerWidth],
                        }),
                        transform: [
                            {
                                translateX: animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, containerWidth],
                                }),
                            },
                        ],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 2, // Height of the line
        width: "100%", // Full width of the screen
        backgroundColor: "lightgray", // Color of the background
    },
    line: {
        height: "100%",
        width: 2,
        // borderRadius: 5, // Half of the line width to create a rounded line
    },
});

export default Spinner;
