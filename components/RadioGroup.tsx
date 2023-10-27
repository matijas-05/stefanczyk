import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface RadioGroupProps {
    options: string[];
    selected: string;
    setSelected: (selected: string) => void;
}
export default function RadioGroup(props: RadioGroupProps) {
    return props.options.map((opt, i) => (
        <View key={i} style={styles.radioButton}>
            <RadioButton
                toggled={props.selected === opt}
                onToggled={() => props.setSelected(opt)}
            />
            <Text style={styles.radioButtonText}>{opt}</Text>
        </View>
    ));
}

interface RadioButtonProps {
    toggled: boolean;
    onToggled: () => void;
}
function RadioButton(props: RadioButtonProps) {
    return (
        <Pressable
            style={styles.radioButtonOuter}
            onPress={() => {
                props.onToggled();
            }}
        >
            <View style={props.toggled && styles.radioButtonInner} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    radioButtonOuter: {
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#EA1E63",
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    radioButtonInner: {
        borderRadius: 50,
        backgroundColor: "#EA1E63",
        width: 14,
        height: 14,
    },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
        gap: 8,
    },
    radioButtonText: {
        fontWeight: "bold",
        fontSize: 16,
    },
});
