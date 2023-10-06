import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Switch, Alert, FlatList, Text } from "react-native";

import Button from "../Button";

interface Position {
    location: Location.LocationObject;
    toggle: boolean;
}

export default function PositionList() {
    const [positions, setPositions] = useState<Position[]>([]);
    useEffect(() => {
        Location.requestForegroundPermissionsAsync();
    }, []);

    async function addPosition() {
        try {
            const pos = await Location.getCurrentPositionAsync();
            Alert.alert("Sukces", "Pobrano pozycję. Czy zapisać?", [
                {
                    text: "Tak",
                    onPress: () => setPositions([...positions, { location: pos, toggle: false }]),
                },
                {
                    text: "Nie",
                },
            ]);
        } catch (e) {
            Alert.alert("Błąd", "Nie udało się pobrać pozycji");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttons}>
                <Button title="POBIERZ I ZAPISZ POZYCJĘ" onPress={addPosition} />
                <Button title="USUŃ WSZYSTKIE DANE" onPress={() => setPositions([])} />
            </View>

            <View style={styles.buttons}>
                <Button title="PRZEJDŹ DO MAPY" />
                <Switch />
            </View>

            <FlatList
                data={positions}
                renderItem={({ item }) => <Text>{JSON.stringify(item, null, 2)}</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    buttons: {
        flexDirection: "row",
        gap: 16,
    },
});
