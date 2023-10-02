import { useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { View, Image, StyleSheet, Text } from "react-native";

export default function Details() {
    const { params } = useRoute();

    const date = useMemo(() => {
        const fmt = new Intl.DateTimeFormat("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
        return fmt.format(new Date(params.user.date)).replace(",", "");
    }, [params.user.date]);

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/user.png")} />

            <Text style={styles.label}>login:</Text>
            <Text style={styles.value}>{params.user.login}</Text>

            <Text style={styles.label}>password:</Text>
            <Text style={styles.value}>{params.user.password}</Text>

            <Text style={styles.label}>registered:</Text>
            <Text style={styles.value}>{date}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: 8,
    },
    label: {
        fontSize: 20,
        color: "gray",
    },
    value: {
        fontSize: 24,
        fontWeight: "bold",
        color: "green",
    },
});
