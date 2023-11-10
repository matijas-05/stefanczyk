import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

import { Navigation } from "../../App";

export default function Splash() {
    const { navigate } = useNavigation<Navigation>();

    return (
        <View style={styles.container}>
            <Text style={styles.logo} onPress={() => navigate("AlarmList")}>
                Sqlite App
            </Text>
            <View>
                <Text style={styles.nav}>manage sqlite</Text>
                <Text style={styles.nav}>use animation</Text>
                <Text style={styles.nav}>use ring</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#512da7",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    logo: {
        textAlign: "center",
        fontFamily: "Poppins-Bold",
        fontSize: 52,
    },
    nav: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "300",
    },
});
