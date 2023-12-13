import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, Switch, Animated, useAnimatedValue } from "react-native";

import { Navigation } from "../../App";
import { Alarm as AlarmType, Database } from "../../Database";
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

interface AlarmProps {
    data: AlarmType;
    selected: boolean;
    setSelected: (value: boolean) => void;
    updateAlarms: () => void;
}

const HIDDEN = 0;
const VISIBLE = 25;
const DAYS = ["PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"];

function Alarm(props: AlarmProps) {
    const height = useAnimatedValue(HIDDEN);
    const [expanded, setExpanded] = useState(false);
    const [daysSelected, setDaysSelected] = useState(new Set<number>());

    useEffect(() => {
        const days = new Set<number>();
        for (let i = 0; i < props.data.days.length; i++) {
            if (props.data.days[i] === "1") {
                days.add(i);
            }
        }
        setDaysSelected(days);
    }, []);

    return (
        <View style={styles.alarm}>
            <View style={styles.alarmRow}>
                <Text style={{ fontSize: 48 }}>{props.data.time}</Text>
                <Switch value={props.selected} onValueChange={props.setSelected} />
            </View>

            <View style={styles.alarmRow}>
                <CircleButton
                    style={{ width: 24, height: 24 }}
                    onPress={async () => {
                        await Database.deleteAlarm(props.data.id);
                        props.updateAlarms();
                    }}
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

            <Animated.View style={[{ maxHeight: height }]}>
                <FlatList
                    data={DAYS}
                    horizontal
                    contentContainerStyle={styles.alarmDays}
                    renderItem={({ item: day, index }) => (
                        <CircleButton
                            key={index}
                            style={[
                                styles.alarmDay,
                                {
                                    backgroundColor: daysSelected.has(index)
                                        ? "black"
                                        : "transparent",
                                },
                            ]}
                            onPress={() => {
                                const newDays = new Set(daysSelected);
                                if (newDays.has(index)) {
                                    newDays.delete(index);
                                } else {
                                    newDays.add(index);
                                }
                                setDaysSelected(newDays);

                                let days = "0000000";
                                for (const day of newDays) {
                                    days = days.substring(0, day) + "1" + days.substring(day + 1);
                                }
                                Database.updateAlarm(props.data.id, days);
                            }}
                        >
                            {day}
                        </CircleButton>
                    )}
                />
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
        width: 32,
        height: 32,
        fontSize: 8,
    },
});
