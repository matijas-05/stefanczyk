import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Key } from "./Key";

const inputs = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [".", "0", "="],
];
const actions = ["Del", "C", "/", "*", "-", "+"];
const landscapeActions = ["Sqrt", "Pow", "Sin", "Cos"];

interface Props {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    setResult: React.Dispatch<React.SetStateAction<string>>;
}
export default function Keypad(props: Props) {
    const [landscape, setLandscape] = useState(false);
    useEffect(() => {
        // Get initial orientation
        (async () => {
            const orientation = await ScreenOrientation.getOrientationAsync();
            setLandscape(
                orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT,
            );
        })();

        // Listen for orientation changes
        const sub = ScreenOrientation.addOrientationChangeListener((e) => {
            const orientation = e.orientationInfo.orientation;
            setLandscape(
                orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT,
            );
        });
        return () => ScreenOrientation.removeOrientationChangeListener(sub);
    }, []);

    function setInput(char: string) {
        if (
            (char.charCodeAt(0) >= "0".charCodeAt(0) && char.charCodeAt(0) <= "9".charCodeAt(0)) ||
            char === "."
        ) {
            props.setInput((prev) => prev + char);
            return;
        }

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

        // Forbid multiple operators together
        if (isNaN(Number(props.input.at(-1))) && isNaN(Number(char))) {
            return;
        }

        switch (char) {
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
            case "Sqrt": {
                props.setResult((prev) => {
                    if (prev !== "") {
                        return Math.sqrt(Number(prev)).toString();
                    } else {
                        return "";
                    }
                });
                break;
            }
            case "Pow": {
                props.setResult((prev) => {
                    if (prev !== "") {
                        return Math.pow(Number(prev), 2).toString();
                    } else {
                        return "";
                    }
                });
                break;
            }
            case "Sin": {
                props.setResult((prev) => {
                    if (prev !== "") {
                        return Math.sin(Number(prev)).toString();
                    } else {
                        return "";
                    }
                });
                break;
            }
            case "Cos": {
                props.setResult((prev) => {
                    if (prev !== "") {
                        return Math.cos(Number(prev)).toString();
                    } else {
                        return "";
                    }
                });
                break;
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
            {landscape && (
                <View style={styles.actions}>
                    {landscapeActions.map((item) => (
                        <Key key={item} title={item} onPress={setInput} />
                    ))}
                </View>
            )}
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
