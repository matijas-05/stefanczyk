import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState, useEffect } from "react";
import { useAnimatedValue, View, Switch, Animated, FlatList, Text, StyleSheet } from "react-native";

import CircleButton from "./CircleButton";
import { Alarm as AlarmType, Database } from "../Database";

const HIDDEN = 0;
const VISIBLE = 25;
const DAYS = ["PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"];

interface AlarmProps {
    data: AlarmType;
    selected: boolean;
    setSelected: (value: boolean) => void;
    updateAlarms: () => void;
}

export function Alarm(props: AlarmProps) {
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
