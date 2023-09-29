import { useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

import Button from "../Button";

export default function Main() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const passwordRef = useRef<TextInput>(null);

    function onSubmit() {
        alert(`${login}, ${password}`);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Register App</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.formHeader}>Welcome in app!</Text>

                <TextInput
                    style={styles.formInput}
                    placeholder="Login"
                    onChangeText={setLogin}
                    textContentType="username"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    blurOnSubmit={false}
                />
                <TextInput
                    ref={passwordRef}
                    style={styles.formInput}
                    placeholder="Password"
                    onChangeText={setPassword}
                    textContentType="password"
                    autoCapitalize="none"
                    returnKeyType="go"
                    secureTextEntry
                    onSubmitEditing={onSubmit}
                />

                <Button title="REGISTER" onPress={onSubmit} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        alignItems: "center",
    },
    header: {
        flex: 1,
        backgroundColor: "green",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    headerText: {
        fontSize: 50,
    },

    form: {
        flex: 1,
        gap: 16,
    },
    formHeader: {
        fontSize: 16,
        opacity: 0.5,
        textAlign: "center",
    },
    formInput: {
        fontSize: 20,
        borderBottomWidth: 2,
        borderBottomColor: "green",
        paddingBottom: 2,
        width: 150,
    },
});
