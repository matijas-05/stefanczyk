import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

import { Navigation } from "../../App";

export default function SplashScreen() {
    const { navigate } = useNavigation<Navigation>();

    return (
        <View style={styles.container}>
            <Text style={styles.logo} onPress={() => navigate("Gallery")}>
                Camera Settings App
            </Text>
            <View>
                <Text style={styles.nav}>change camera white balance</Text>
                <Text style={styles.nav}>change camera flash mode</Text>
                <Text style={styles.nav}>change camera picture size</Text>
                <Text style={styles.nav}>change camera camera ratio</Text>
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
