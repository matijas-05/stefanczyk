import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Animated, useAnimatedValue, Dimensions } from "react-native";

import RadioGroup from "./RadioGroup";

const OPENED = 0;
const CLOSED = -Dimensions.get("window").width / 2;

interface Props {
    open: boolean;
    setOpen: (enabled: boolean) => void;
}
export default function Settings(props: Props) {
    const pos = useAnimatedValue(CLOSED);
    const [whiteBalance, setWhiteBalance] = useState("auto");

    useEffect(() => {
        Animated.spring(pos, {
            toValue: props.open ? OPENED : CLOSED,
            velocity: 1,
            tension: 0,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, [props.open]);

    return (
        <Animated.View style={[styles.container, { transform: [{ translateX: pos }] }]}>
            <Text style={styles.h1}>SETTINGS</Text>
            <Text style={styles.h2}>WHITE BALANCE</Text>
            <RadioGroup
                options={["auto", "cloudy", "fluorescent", "incandescent", "shadow", "sunny"]}
                selected={whiteBalance}
                setSelected={setWhiteBalance}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        opacity: 0.5,
        width: Dimensions.get("window").width / 2,
        padding: 8,
    },
    h1: {
        fontWeight: "bold",
        fontSize: 30,
    },
    h2: {
        fontWeight: "bold",
        fontSize: 20,
        color: "yellow",
    },
});
