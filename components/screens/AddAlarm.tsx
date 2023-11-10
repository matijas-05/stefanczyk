import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { View, StyleSheet, Text } from "react-native";

import CircleButton from "../CircleButton";

export default function AddAlarm() {
    return (
        <View style={styles.container}>
            <Text>"+" dodaje do bazy budzik z godziną 00:00</Text>
            <CircleButton style={styles.addButton} icon={<AntDesign name="plus" size={36} />} />
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
