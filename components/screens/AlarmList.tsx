import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";

import { Navigation } from "../../App";
import CircleButton from "../CircleButton";

export default function AlarmList() {
    const { navigate } = useNavigation<Navigation>();

    return (
        <View style={styles.container}>
            <CircleButton
                style={styles.addButton}
                icon={<AntDesign name="plus" size={36} />}
                onPress={() => navigate("AddAlarm")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#512da7",
        flex: 1,
        alignItems: "center",
    },
    addButton: {
        position: "absolute",
        bottom: 32,
    },
});
