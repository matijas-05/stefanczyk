import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Switch, Alert, FlatList, Text } from "react-native";

import Button from "../Button";

interface PositionType {
    position: Location.LocationObject;
    selected: boolean;
}

export default function PositionList() {
    const [positions, setPositions] = useState<PositionType[]>([]);
    const [allSelected, setAllSelected] = useState(false);

    useEffect(() => {
        Location.requestForegroundPermissionsAsync();
    }, []);

    async function addPosition() {
        try {
            const pos = await Location.getCurrentPositionAsync();
            Alert.alert("Sukces", "Pobrano pozycję. Czy zapisać?", [
                {
                    text: "Tak",
                    onPress: () => setPositions([...positions, { position: pos, selected: false }]),
                },
                {
                    text: "Nie",
                },
            ]);
        } catch (e) {
            Alert.alert("Błąd", "Nie udało się pobrać pozycji");
        }
    }
    function goToMap() {
        if (positions.length === 0) {
            alert("Zaznacz przynajmniej jedną pozycję.");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttons}>
                <Button title="POBIERZ I ZAPISZ POZYCJĘ" onPress={addPosition} />
                <Button title="USUŃ WSZYSTKIE DANE" onPress={() => setPositions([])} />
            </View>

            <View style={styles.buttons}>
                <Button title="PRZEJDŹ DO MAPY" onPress={goToMap} />
                <Switch
                    value={allSelected}
                    onValueChange={(value) => {
                        setPositions(positions.map((pos) => ({ ...pos, selected: value })));
                        setAllSelected(value);
                    }}
                />
            </View>

            <FlatList
                data={positions}
                renderItem={({ item, index }) => (
                    <Position
                        position={item}
                        selectedChanged={(selected) =>
                            setPositions(() => {
                                const newPositions = positions.map((pos, i) =>
                                    i === index ? { ...pos, selected } : pos,
                                );
                                if (newPositions.every((pos) => pos.selected)) {
                                    setAllSelected(true);
                                } else {
                                    setAllSelected(false);
                                }

                                return newPositions;
                            })
                        }
                    />
                )}
            />
        </View>
    );
}

function Position({
    position,
    selectedChanged,
}: {
    position: PositionType;
    selectedChanged: (value: boolean) => void;
}) {
    return (
        <View style={styles.positionContainer}>
            <View style={styles.position}>
                <Text style={styles.positionHeader}>timestamp: {position.position.timestamp}</Text>
                <Text style={styles.positionInfo}>
                    latitude: {position.position.coords.latitude}
                </Text>
                <Text style={styles.positionInfo}>
                    longitude: {position.position.coords.longitude}
                </Text>
            </View>
            <Switch value={position.selected} onValueChange={(value) => selectedChanged(value)} />
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
    positionContainer: {
        flexDirection: "row",
        gap: 16,
    },
    position: {
        padding: 16,
    },
    positionHeader: {
        fontSize: 20,
        color: "rgb(66 80 175)",
    },
    positionInfo: {
        fontSize: 16,
        color: "gray",
    },
});
