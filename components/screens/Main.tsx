import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

import { StackNavigation } from "../../App";

export default function Main() {
    const navigate = useNavigation<StackNavigation>();

    return (
        <View style={styles.container}>
            <Text style={styles.logo} onPress={() => navigate.navigate("PositionList")}>
                Geo App
            </Text>
            <View>
                <Text style={styles.nav}>find and save your position</Text>
                <Text style={styles.nav}>use google maps</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgb(66 80 175)",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    logo: {
        fontFamily: "Poppins-Bold",
        fontSize: 52,
    },
    nav: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "300",
    },
});
