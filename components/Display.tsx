import { View, Text, StyleSheet } from "react-native";

export const Display = () => {
    return (
        <View style={styles.display}>
            <Text style={styles.text}>2+2</Text>
            <Text style={styles.text}>4</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    display: {
        backgroundColor: "green",
        flexDirection: "column",
        gap: 40,
        paddingHorizontal: 10,
        paddingTop: 30,
        paddingBottom: 10,
    },
    text: {
        fontSize: 50,
        textAlign: "right",
        fontFamily: "monospace",
    },
});
