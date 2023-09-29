import { View, Text, StyleSheet, StatusBar } from "react-native";

interface Props {
    input: string;
    result: string;
}
export function Display(props: Props) {
    return (
        <View style={styles.display}>
            <StatusBar />
            <Text style={styles.text}>{props.input}</Text>
            <Text style={styles.text}>{props.result}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    display: {
        backgroundColor: "green",
        flexDirection: "column",
        gap: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
        height: "30%",
    },
    text: {
        fontSize: 30,
        textAlign: "right",
        fontFamily: "monospace",
    },
});
