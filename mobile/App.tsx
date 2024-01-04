import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer } from "expo-sensors";
import type { Subscription } from "expo-sensors/build/Pedometer";

const socket = new WebSocket("ws://192.168.0.106:8082");

export default function App() {
    const [acc, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [sendData, setSendData] = useState(true);
    const isOpen = useRef(false);

    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const _subscribe = () => {
        setSubscription(Accelerometer.addListener(setData));
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

    useEffect(() => {
        console.log(acc);
        if (isOpen.current && sendData) {
            socket.send(JSON.stringify(acc));
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
