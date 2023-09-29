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
        alignItems: "center",
        backgroundColor: "green",
        padding: 10,
        borderRadius: 16,
    },
    text: {
        fontWeight: "bold",
        fontSize: 16,
    },
});
