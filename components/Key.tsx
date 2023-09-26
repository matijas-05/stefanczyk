import React from "react";
import { Text, StyleSheet, TouchableHighlight } from "react-native";

interface Props {
    title: string;
    onPress: (char: string) => void;
}
export function Key(props: Props) {
    return (
        <TouchableHighlight
            style={styles.key}
            underlayColor="#eee"
            onPress={() => props.onPress(props.title)}
        >
            <Text style={styles.keyText}>{props.title}</Text>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    key: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    keyText: {
        fontSize: 30,
        fontFamily: "monospace",
    },
});
