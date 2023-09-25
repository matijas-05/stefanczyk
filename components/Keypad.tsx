import React from "react";
import { StyleSheet, View } from "react-native";

import { Key } from "./Key";

const inputs = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [".", "0", "="],
];
const actions = ["Del", "C", "/", "*", "-", "+"];

interface Props {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    setResult: React.Dispatch<React.SetStateAction<string>>;
}
export default function Keypad(props: Props) {
    function setInput(char: string) {
        if (
            (char.charCodeAt(0) >= "0".charCodeAt(0) && char.charCodeAt(0) <= "9".charCodeAt(0)) ||
            char === "."
        ) {
            props.setInput((prev) => prev + char);
        } else {
            switch (char) {
                case "Del": {
                    props.setInput((prev) => prev.slice(0, -1));
                    break;
                }
                case "C": {
                    props.setInput("");
                    props.setResult("");
                    break;
                }
                case "/": {
                    props.setInput((prev) => prev + "/");
                    break;
                }
                case "*": {
                    props.setInput((prev) => prev + "*");
                    break;
                }
                case "-": {
                    props.setInput((prev) => prev + "-");
                    break;
                }
                case "+": {
                    props.setInput((prev) => prev + "+");
                    break;
                }
                case "=": {
                    try {
                        const result = Number(eval(props.input));
                        if (!isNaN(result)) {
                            props.setResult(Number(result.toFixed(9)).toString());
                        } else {
                            props.setResult("");
                        }
                    } catch (_) {
                        props.setResult("Err");
                    }
                    break;
                }
            }
        }
    }

    return (
        <View style={styles.keypad}>
            <View style={styles.inputs}>
                {inputs.map((row, i) => (
                    <View key={i} style={styles.inputsRow}>
                        {row.map((item, i) => (
                            <Key key={i} title={item} onPress={setInput} />
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.actions}>
                {actions.map((item) => (
                    <Key key={item} title={item} onPress={setInput} />
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
