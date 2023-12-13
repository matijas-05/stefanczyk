import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, StyleSheet, Vibration } from "react-native";

import { Navigation } from "../../App";
import { type Alarm as AlarmType, Database } from "../../database";
import Alarm from "../Alarm";
import CircleButton from "../CircleButton";

export default function AlarmList() {
    const navigation = useNavigation<Navigation>();
    const [alarms, setAlarms] = useState<AlarmType[]>([]);
    const [vibrationAllowed, setVibrationAllowed] = useState(new Set<number>());
    const [audioAllowed, setAudioAllowed] = useState(new Set<number>());

    const playingAudio = useRef(false);
    const playingVibration = useRef(false);
    const audio = useRef<Audio.Sound>();

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            updateAlarms();
        });
        return unsubscribe;
    }, []);
    async function updateAlarms() {
        const alarms = await Database.getAlarms();
        setAlarms(alarms);

        for (const alarm of alarms) {
            if (alarm.vibration) {
                const newVibration = new Set(vibrationAllowed);
                newVibration.add(alarm.id);
                setVibrationAllowed(newVibration);
            } else {
                const newVibration = new Set(vibrationAllowed);
                newVibration.delete(alarm.id);
                setVibrationAllowed(newVibration);
            }

            if (alarm.audio) {
                const newAudio = new Set(audioAllowed);
                newAudio.add(alarm.id);
                setAudioAllowed(newAudio);
            } else {
                const newAudio = new Set(audioAllowed);
                newAudio.delete(alarm.id);
                setAudioAllowed(newAudio);
            }
        }
    }

    useInterval(() => {
        checkAlarms();
    }, 500);
    async function checkAlarms() {
        for (const alarm of alarms) {
            const now = new Date();
            const hours = parseInt(alarm.time.split(":")[0]!);
            const minutes = parseInt(alarm.time.split(":")[1]!);

            // Play when right time
            if (now.getHours() === hours && now.getMinutes() === minutes) {
                if (!playingAudio.current && audioAllowed.has(alarm.id)) {
                    const { sound } = await Audio.Sound.createAsync(
                        require("../../assets/alarm.mp3"),
                    );
                    audio.current = sound;
                    sound.setIsLoopingAsync(true);
                    sound.playAsync();
                    playingAudio.current = true;
                }
                if (!playingVibration.current && vibrationAllowed.has(alarm.id)) {
                    Vibration.vibrate([0, 10000], true);
                    playingVibration.current = true;
                }
            } else {
                // Stop when wrong time
                audio.current?.stopAsync();
                Vibration.cancel();
                playingAudio.current = false;
                playingVibration.current = false;
            }

            // Disable when user disabled
            if (playingAudio.current && !audioAllowed.has(alarm.id)) {
                audio.current?.stopAsync();
                playingAudio.current = false;
            }
            if (playingVibration.current && !vibrationAllowed.has(alarm.id)) {
                Vibration.cancel();
                playingVibration.current = false;
            }
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={alarms}
                ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
                renderItem={({ item }) => (
                    <Alarm
                        data={item}
                        vibration={vibrationAllowed.has(item.id)}
                        setVibration={(value) => {
                            const newVibration = new Set(vibrationAllowed);
                            if (value) {
                                newVibration.add(item.id);
                            } else {
                                newVibration.delete(item.id);
                            }
                            setVibrationAllowed(newVibration);
                            Database.updateAlarm(
                                item.id,
                                item.days,
                                value ? 1 : 0,
                                audioAllowed.has(item.id) ? 1 : 0,
                            );
                        }}
                        audio={audioAllowed.has(item.id)}
                        setAudio={(value) => {
                            const newAudio = new Set(audioAllowed);
                            if (value) {
                                newAudio.add(item.id);
                            } else {
                                newAudio.delete(item.id);
                            }
                            setAudioAllowed(newAudio);
                            Database.updateAlarm(
                                item.id,
                                item.days,
                                vibrationAllowed.has(item.id) ? 1 : 0,
                                value ? 1 : 0,
                            );
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
