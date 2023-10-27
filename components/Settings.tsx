import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, useAnimatedValue, Dimensions } from "react-native";

const OPENED = 0;
const CLOSED = -Dimensions.get("window").width / 2;

interface Props {
    open: boolean;
    setOpen: (enabled: boolean) => void;
}
export default function Settings(props: Props) {
    const pos = useAnimatedValue(CLOSED);

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
            <Text>Settings</Text>
            <Text>Settings</Text>
            <Text>Settings</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        opacity: 0.5,
        width: Dimensions.get("window").width / 2,
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
