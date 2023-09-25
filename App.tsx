import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Display } from "./components/Display";
import Keypad from "./components/Keypad";

export default function App() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");

    return (
        <View style={styles.root}>
            <Display input={input} result={result} />
            <Keypad input={input} setInput={setInput} setResult={setResult} />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
    },
});
