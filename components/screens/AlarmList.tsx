import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";

import { Navigation } from "../../App";
import { Alarm as AlarmType, Database } from "../../Database";
import { Alarm } from "../Alarm";
import CircleButton from "../CircleButton";

export default function AlarmList() {
    const navigation = useNavigation<Navigation>();
    const [alarms, setAlarms] = useState<AlarmType[]>([]);
    const [selected, setSelected] = useState(new Set<number>());

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", updateAlarms);
        return unsubscribe;
    }, []);
    async function updateAlarms() {
        const alarms = await Database.getAlarms();
        setAlarms(alarms);
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={alarms}
                ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
                renderItem={({ item }) => (
                    <Alarm
                        data={item}
                        selected={selected.has(item.id)}
                        setSelected={(value) => {
                            const newSelected = new Set(selected);
                            if (value) {
                                newSelected.add(item.id);
                            } else {
                                newSelected.delete(item.id);
                            }
                            setSelected(newSelected);
                        }}
                        updateAlarms={updateAlarms}
                    />
                )}
            />

            <CircleButton style={styles.addButton} onPress={() => navigation.navigate("AddAlarm")}>
                <AntDesign name="plus" size={32} />
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
