import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface Props extends TouchableOpacityProps {
    icon: React.ReactNode;
}
export default function CircleButton({ icon, ...props }: Props) {
    return (
        <TouchableOpacity {...props} style={StyleSheet.compose(styles.button, props.style)}>
            <Text style={styles.text}>{icon}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#EA1E63",
        width: 64,
        height: 64,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.5,
    },
    text: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
    },
});
