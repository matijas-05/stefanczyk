import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { View, StyleSheet, Text } from "react-native";

import { Database } from "../../Database";
import CircleButton from "../CircleButton";

export default function AddAlarm() {
    return (
        <View style={styles.container}>
            <Text>"+" dodaje do bazy budzik z godziną 00:00</Text>
            <CircleButton
                style={styles.addButton}
                onPress={async () => {
                    await Database.addAlarm();
                    alert("Dodano budzik");
                }}
            >
                <AntDesign name="plus" size={36} />
            </CircleButton>
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
        backgroundColor: "#EA1E63",
        position: "absolute",
        bottom: 32,
        width: 64,
        height: 64,
    },
});
