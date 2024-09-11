import React, { useRef, useEffect, useState } from "react";
import { Animated, Image, Easing, StyleSheet, View } from "react-native";
import feelsOkMan from "../static/images/feels_ok_man.png";
import feelsStrongMan from "../static/images/feels_strong_man.png";
import pepeLaugh from "../static/images/pepe_laugh.png";
import feelsWeirdMan from "../static/images/feels_weird_man.png";
import monkaHmm from "../static/images/monka_hmm.png";
import yep from "../static/images/yep.png";

const SpinningEmote = () => {
    const [currentEmoteIndex, setCurrentEmoteIndex] = useState(0);
    const spinValue = useRef(new Animated.Value(0)).current;
    const emoteSources = [feelsOkMan, feelsStrongMan, pepeLaugh, feelsWeirdMan, monkaHmm, yep];

    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEmoteIndex((prevIndex) => (prevIndex === emoteSources.length - 1 ? 0 : prevIndex + 1));
        }, 2000); // Rotate emotes every 5 seconds (adjust as needed)
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000, // Adjust duration as needed
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        return () => clearInterval(interval);
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.emotes}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Image source={emoteSources[currentEmoteIndex]} style={{ width: 100, height: 100 }} />
            </Animated.View>
        </View>
    );
};
const styles = StyleSheet.create({
    emotes: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
export default SpinningEmote;
