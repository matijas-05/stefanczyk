import React from "react";
import { StyleSheet, View } from "react-native";

import { Key } from "./Key";

const inputs = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "="],
];
const actions = ["C", "/", "*", "-", "+"];

export default function Keypad() {
    return (
        <View style={styles.keypad}>
            <View style={styles.inputs}>
                {inputs.map((row, i) => (
                    <View key={i} style={styles.inputsRow}>
                        {row.map((item, i) => (
                            <Key key={i} title={item} />
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.actions}>
                {actions.map((item) => (
                    <Key key={item} title={item} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    keypad: {
        flex: 1,
        flexDirection: "row",
    },
    inputs: {
        flex: 1,
        flexGrow: 3,
        flexDirection: "column",
        backgroundColor: "#ddd",
    },
    inputsRow: {
        flex: 1,
        flexDirection: "row",
    },
    actions: {
        flex: 1,
        flexGrow: 1,
        flexDirection: "column",
        backgroundColor: "#ccc",
    },
});
