import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Dialog from "react-native-dialog";

import { Config } from "../../config";
import Button from "../Button";

export default function Settings() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [ip, setIp] = useState<string>();
    const [port, setPort] = useState<string>();
    const ipInputRef = useRef<TextInput>(null);

    useEffect(() => {
        (async () => {
            setIp(await Config.apiIp);
            setPort(await Config.apiPort);
        })();
    }, []);

    function saveSettings() {
        Config.apiIp = ip!;
        Config.apiPort = port!;
        setDialogOpen(false);
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.text}>
                    Obecnie zapisane IP:{"\n"}
                    {ip}
                </Text>
                <Text style={styles.text}>
                    Obecnie zapisany PORT:{"\n"}
                    {port}
                </Text>

                <Button
                    style={styles.button}
                    title="PODAJ NOWE DANE"
                    onPress={() => setDialogOpen(true)}
                />
            </View>

            <Dialog.Container visible={dialogOpen}>
                <Dialog.Title>Podaj nowe dane</Dialog.Title>

                <Dialog.Input
                    value={ip}
                    onChangeText={setIp}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    onSubmitEditing={() => ipInputRef.current!.focus()}
                />
                <Dialog.Input
                    textInputRef={ipInputRef}
                    keyboardType="numeric"
                    value={port}
                    onChangeText={(text) => setPort(text)}
                    onSubmitEditing={saveSettings}
                />

                <Dialog.Button label="CANCEL" onPress={() => setDialogOpen(false)} />
                <Dialog.Button label="SAVE" onPress={saveSettings} />
            </Dialog.Container>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        marginBottom: 8,
    },
    button: {
        marginTop: 8,
        maxHeight: 40,
    },
});
