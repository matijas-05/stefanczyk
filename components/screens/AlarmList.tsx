import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, StyleSheet, Vibration } from "react-native";

import { Navigation } from "../../App";
import { type Alarm as AlarmType, Database } from "../../Database";
import Alarm from "../Alarm";
import CircleButton from "../CircleButton";

export default function AlarmList() {
    const navigation = useNavigation<Navigation>();
    const [alarms, setAlarms] = useState<AlarmType[]>([]);
    const [enabled, setEnabled] = useState(new Set<number>());

    const vibrating = useRef(false);
    const audio = useRef<Audio.Sound>();

    useInterval(() => {
        checkAlarms();
    }, 500);
    async function checkAlarms() {
        for (const alarm of alarms) {
            const now = new Date();
            const alarmTime = new Date(
                0,
                0,
                0,
                parseInt(alarm.time.split(":")[0]!),
                parseInt(alarm.time.split(":")[1]!),
                0,
                0,
            );

            if (
                !vibrating.current &&
                now.getHours() === alarmTime.getHours() &&
                now.getMinutes() === alarmTime.getMinutes() &&
                enabled.has(alarm.id)
            ) {
                const { sound } = await Audio.Sound.createAsync(require("../../assets/alarm.mp3"));
                audio.current = sound;
                sound.setIsLoopingAsync(true);
                sound.playAsync();

                Vibration.vibrate([0, 10000], true);
                vibrating.current = true;
            } else if (
                vibrating.current &&
                (now.getHours() !== alarmTime.getHours() ||
                    now.getMinutes() !== alarmTime.getMinutes() ||
                    !enabled.has(alarm.id))
            ) {
                audio.current?.stopAsync();
                Vibration.cancel();
                vibrating.current = false;
            }
        }
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            updateAlarms();
        });
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
                        selected={enabled.has(item.id)}
                        setSelected={(value) => {
                            const newSelected = new Set(enabled);
                            if (value) {
                                newSelected.add(item.id);
                            } else {
                                newSelected.delete(item.id);
                            }
                            setEnabled(newSelected);
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

function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef<(() => void) | null>(null);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        const id = setInterval(() => savedCallback.current?.(), delay);
        return () => clearInterval(id);
    }, [delay]);
}
