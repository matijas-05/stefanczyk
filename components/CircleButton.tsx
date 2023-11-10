import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableNativeFeedback,
    TouchableOpacityProps,
    View,
} from "react-native";

interface Props extends TouchableOpacityProps {
    children: React.ReactNode;
    textStyle?: StyleProp<TextStyle>;
}
export default function CircleButton({ children, textStyle, ...rest }: Props) {
    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple("rgba(255,255,255,1)", true)}
            {...rest}
        >
            <View style={StyleSheet.compose(styles.button, rest.style)}>
                <Text style={StyleSheet.compose(styles.text, textStyle)}>{children}</Text>
            </View>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});
