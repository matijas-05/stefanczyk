import { StyleSheet, View } from "react-native";

import { Display } from "./components/Display";
import Keypad from "./components/Keypad";

export default function App() {
    return (
        <View style={styles.root}>
            <Display />
            <Keypad />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
    },
});
