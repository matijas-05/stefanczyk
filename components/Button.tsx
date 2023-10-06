import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface Props extends TouchableOpacityProps {
    title: string;
}
export default function Button({ title, ...props }: Props) {
    return (
        <TouchableOpacity {...props} style={StyleSheet.compose(styles.button, props.style)}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "rgb(66 80 175)",
        padding: 8,
        borderRadius: 16,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: "bold",
        textAlign: "center",
    },
});
