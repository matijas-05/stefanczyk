import React from "react";
import { Text, StyleSheet, TouchableHighlight } from "react-native";

export function Key(props: { title: string }) {
    return (
        <TouchableHighlight style={styles.key} underlayColor="#eee" onPress={() => false}>
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
        fontSize: 40,
        fontFamily: "monospace",
    },
});
