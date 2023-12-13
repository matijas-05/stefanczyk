import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { View, StyleSheet, Text, useWindowDimensions } from "react-native";

import { Database } from "../../Database";
import CircleButton from "../CircleButton";
import TimeSelect from "../TimeSelect";

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const HOURS_24 = [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export default function AddAlarm() {
    const [timePart, setTimePart] = useState<"hour" | "minute">("hour");
    const [hour, setHour] = useState(new Date().getHours().toString());
    const [minute, setMinute] = useState(new Date().getMinutes().toString());
    const dimensions = useWindowDimensions();

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
    addButton: {
        backgroundColor: "#EA1E63",
        marginBottom: 32,
        width: 64,
        height: 64,
    },
});
