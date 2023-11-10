import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, FlatList, Text, Switch, Animated, useAnimatedValue } from "react-native";

import { Navigation } from "../../App";
import { Alarm as AlarmType, Database } from "../../Database";
import CircleButton from "../CircleButton";

export default function AlarmList() {
    const { navigate } = useNavigation<Navigation>();
    const [alarms, setAlarms] = useState<AlarmType[]>([]);
    const [selected, setSelected] = useState<Set<number>>(new Set());

    useFocusEffect(() => {
        (async () => {
            const alarms = await Database.getAlarms();
            setAlarms(alarms);
        })();
    });

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
                    />
                )}
            />

            <CircleButton style={styles.addButton} onPress={() => navigate("AddAlarm")}>
                <AntDesign name="plus" size={36} />
            </CircleButton>
        </View>
    );
}

interface AlarmProps {
    data: AlarmType;
    selected: boolean;
    setSelected: (value: boolean) => void;
}

const HIDDEN = 0;
const VISIBLE = 25;
const days = ["PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"];

function Alarm(props: AlarmProps) {
    const height = useAnimatedValue(HIDDEN);
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.alarm}>
            <View style={styles.alarmRow}>
                <Text style={{ fontSize: 48 }}>{props.data.time}</Text>
                <Switch value={props.selected} onValueChange={props.setSelected} />
            </View>

            <View style={styles.alarmRow}>
                <CircleButton
                    style={{ width: 24, height: 24 }}
                    onPress={() => Database.deleteAlarm(props.data.id)}
                >
                    <FontAwesome5 name="trash" size={16} />
                </CircleButton>
                <CircleButton
                    style={{ width: 24, height: 24 }}
                    onPress={() => {
                        Animated.spring(height, {
                            toValue: expanded ? HIDDEN : VISIBLE,
                            useNativeDriver: false,
                        }).start();
                        setExpanded(!expanded);
                    }}
                >
                    <FontAwesome5 name={expanded ? "angle-up" : "angle-down"} size={24} />
                </CircleButton>
            </View>

            <Animated.View style={[styles.alarmDays, { height }]}>
                {days.map((day, i) => (
                    <CircleButton key={i} style={styles.alarmDay}>
                        {day}
                    </CircleButton>
                ))}
            </Animated.View>
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
    alarm: {
        gap: 8,
    },
    alarmRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 64,
    },
    alarmDays: {
        flexDirection: "row",
        gap: 8,
        justifyContent: "space-between",
    },
    alarmDay: {
        width: 24,
        height: 24,
        fontSize: 8,
    },
});
