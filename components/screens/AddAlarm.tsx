import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, useWindowDimensions, Vibration } from "react-native";

import { Database } from "../../Database";
import CircleButton from "../CircleButton";
import TimeSelect from "../TimeSelect";

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const HOURS_24 = [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export default function AddAlarm() {
    const [timePart, setTimePart] = useState<"hour" | "minute">("hour");
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const dimensions = useWindowDimensions();

    useEffect(() => {
        const now = new Date();
        const hours = now.getHours().toString();
        const minutes = now.getMinutes().toString();

        setHour(hours.length === 1 ? "0" + hours : hours);
        setMinute(minutes.length === 1 ? "0" + minutes : minutes);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.timeContainer}>
                <Text
                    style={[styles.time, { color: timePart === "hour" ? "red" : "white" }]}
                    onPress={() => setTimePart("hour")}
                >
                    {hour}
                </Text>

                <Text style={styles.time}>:</Text>

                <Text
                    style={[styles.time, { color: timePart === "minute" ? "red" : "white" }]}
                    onPress={() => setTimePart("minute")}
                >
                    {minute}
                </Text>
            </View>

            {timePart === "hour" ? (
                <>
                    <TimeSelect
                        containerStyle={{
                            position: "absolute",
                            top: dimensions.height / 2 - 50,
                            right: dimensions.width / 2 - 20,
                        }}
                        inputs={HOURS}
                        onChanged={setHour}
                        radius={160}
                    />
                    <TimeSelect
                        containerStyle={{
                            position: "absolute",
                            top: dimensions.height / 2 - 50,
                            right: dimensions.width / 2 - 20,
                        }}
                        inputs={HOURS_24}
                        onChanged={setHour}
                        radius={100}
                    />
                </>
            ) : (
                <>
                    <TimeSelect
                        containerStyle={{
                            position: "absolute",
                            top: dimensions.height / 2 - 50,
                            right: dimensions.width / 2 - 20,
                        }}
                        inputs={MINUTES}
                        onChanged={setMinute}
                        radius={160}
                    />
                    <View style={styles.adjustTimeContainer}>
                        <CircleButton
                            onPress={() => {
                                Vibration.vibrate(50);
                                setMinute((prev) => {
                                    const num = Math.min(parseInt(prev) + 1, 59).toString();
                                    return num.length === 1 ? "0" + num : num;
                                });
                            }}
                            style={styles.adjustTimeButton}
                            textStyle={{ fontSize: 20 }}
                        >
                            +1
                        </CircleButton>
                        <CircleButton
                            onPress={() => {
                                Vibration.vibrate(50);
                                setMinute((prev) => {
                                    const num = Math.max(0, parseInt(prev) - 1).toString();
                                    return num.length === 1 ? "0" + num : num;
                                });
                            }}
                            style={styles.adjustTimeButton}
                            textStyle={{ fontSize: 20 }}
                        >
                            -1
                        </CircleButton>
                    </View>
                </>
            )}

            <CircleButton
                style={styles.addButton}
                onPress={async () => {
                    await Database.addAlarm(`${hour}:${minute}`);
                    alert("Dodano budzik");
                }}
            >
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
        justifyContent: "space-between",
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        marginTop: 32,
    },
    time: {
        fontSize: 80,
    },
    adjustTimeContainer: {
        gap: 8,
    },
    adjustTimeButton: {
        backgroundColor: "white",
        width: 54,
        height: 54,
    },
    addButton: {
        backgroundColor: "#EA1E63",
        marginBottom: 32,
        width: 64,
        height: 64,
    },
});
