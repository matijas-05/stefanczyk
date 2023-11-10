import React from "react";
import {
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacityProps,
    View,
} from "react-native";

interface Props extends TouchableOpacityProps {
    icon: React.ReactNode;
}
export default function CircleButton({ icon, ...props }: Props) {
    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple("rgba(255,255,255,1)", true)}
            {...props}
        >
            <View style={StyleSheet.compose(styles.button, props.style)}>
                <Text style={styles.text}>{icon}</Text>
            </View>
        </TouchableNativeFeedback>
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
    },
    text: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
    },
});
