import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

import { Navigation } from "../../App";

export default function SplashScreen() {
    const { navigate } = useNavigation<Navigation>();

    return (
        <View style={styles.container}>
            <Text style={styles.logo} onPress={() => navigate("Gallery")}>
                Camera App
            </Text>
            <View>
                <Text style={styles.nav}>take photos</Text>
                <Text style={styles.nav}>upload photos</Text>
                <Text style={styles.nav}>share photos</Text>
                <Text style={styles.nav}>photo settings</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#EA1E63",
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
