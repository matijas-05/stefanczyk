import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

import { NavigationStackParamList } from "../../App";
import Button from "../Button";

export default function Main(props: NativeStackScreenProps<NavigationStackParamList>) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const passwordRef = useRef<TextInput>(null);

    async function onSubmit() {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ login, password }),
        });
        if (res.status === 201) {
            props.navigation.push("Users");
        } else if (res.status === 409) {
            alert("User already exists!");
        }
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
                <Button title="DEBUG" onPress={() => props.navigation.push("Users")} />
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
