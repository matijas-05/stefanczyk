import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

import { StackNavigation } from "../../App";

export default function SplashScreen() {
    const { navigate } = useNavigation<StackNavigation>();

    return (
        <View style={styles.container}>
            <Text style={styles.logo} onPress={() => navigate("Gallery")}>
                Camera App
            </Text>
            <View>
                <Text style={styles.nav}>show gallery pictures</Text>
                <Text style={styles.nav}>take picture from camera</Text>
                <Text style={styles.nav}>save photo to device</Text>
                <Text style={styles.nav}>delete photos from device</Text>
                <Text style={styles.nav}>share photo</Text>
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
        fontFamily: "Poppins-Bold",
        fontSize: 52,
    },
    nav: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "300",
    },
});
