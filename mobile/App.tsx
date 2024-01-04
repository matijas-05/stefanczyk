import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import type { Subscription } from "expo-sensors/build/Pedometer";

const socket = new WebSocket("ws://192.168.0.106:8082");
const ALPHA = 0.8;
const gravity = { x: 0, y: 0, z: 0 };

export default function App() {
    const [acc, setAcc] = useState<AccelerometerMeasurement>({
        x: 0,
        y: 0,
        z: 0,
    });
    const [sendData, setSendData] = useState(true);
    const isOpen = useRef(false);

    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const _subscribe = () => {
        Accelerometer.setUpdateInterval(16);
        setSubscription(Accelerometer.addListener(setAcc));
    };
    const _unsubscribe = () => {
        subscription?.remove();
        setSubscription(null);
    };
    useEffect(() => {
        _subscribe();

        socket.addEventListener("open", (e) => {
            console.log("opened", e);
            isOpen.current = true;
        });
        socket.addEventListener("close", (e) => console.log("closed", e));

        return () => {
            _unsubscribe();
            socket.close();
        };
    }, []);

    // https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion#kotlin
    useEffect(() => {
        // Isolate the force of gravity with the low-pass filter.
        gravity.x = ALPHA * gravity.x + (1 - ALPHA) * acc.x;
        gravity.y = ALPHA * gravity.y + (1 - ALPHA) * acc.y;
        gravity.z = ALPHA * gravity.z + (1 - ALPHA) * acc.z;

        // Remove the gravity contribution with the high-pass filter.
        acc.x = acc.x - gravity.x;
        acc.y = acc.y - gravity.y;
        acc.z = acc.z - gravity.z;

        if (isOpen.current && sendData) {
            socket.send(JSON.stringify(acc));
            console.log(JSON.stringify(acc));
        }
    }, [acc]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
            <Text style={styles.text}>x: {acc.x}</Text>
            <Text style={styles.text}>y: {acc.y}</Text>
            <Text style={styles.text}>z: {acc.z}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={subscription ? _unsubscribe : _subscribe}
                    style={styles.button}
                >
                    <Text>{subscription ? "On" : "Off"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSendData(!sendData)} style={styles.button}>
                    <Text>{sendData ? "Sending to server" : "Not sending to server"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    text: {
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "stretch",
        marginTop: 15,
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eee",
        padding: 10,
    },
    middleButton: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#ccc",
    },
});
