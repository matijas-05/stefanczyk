import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

import { NavigationStackParamList } from "../../App";
import Button from "../Button";

interface UserType {
    login: string;
    password: string;
    date: string;
}

export default function Users(props: NativeStackScreenProps<NavigationStackParamList>) {
    const [users, setUsers] = useState<UserType[]>([]);

    async function fetchUsers() {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`);
        setUsers(await res.json());
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <View style={styles.container}>
            <Button title="BACK TO LOGIN PAGE" onPress={() => props.navigation.pop()} />
            <FlatList
                data={users}
                renderItem={({ item, index }) => (
                    <User {...item} index={index} fetchUsers={() => fetchUsers()} />
                )}
            />
        </View>
    );
}

function User(props: UserType & { index: number; fetchUsers: () => void }) {
    return (
        <View style={styles.user}>
            <View>
                <Image style={styles.userImage} source={require("../../assets/user.png")} />
            </View>
            <View style={styles.userDetails}>
                <View style={styles.userButtons}>
                    <Button title="DETAILS" style={styles.userButton} />
                    <Button
                        title="DELETE"
                        style={styles.userButton}
                        onPress={async () => {
                            await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${props.login}`, {
                                method: "DELETE",
                            });
                            props.fetchUsers();
                        }}
                    />
                </View>
                <Text style={styles.userText}>
                    {props.index}: {props.login}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        gap: 16,
    },
    user: {
        flexDirection: "row",
        gap: 16,
    },
    userDetails: {
        marginVertical: 8,
        gap: 4,
    },
    userText: {
        fontSize: 24,
    },
    userButton: {
        paddingVertical: 6,
    },
    userButtons: {
        flexDirection: "row",
        gap: 6,
    },
    userImage: {
        flex: 1,
        width: 75,
        height: 75,
        resizeMode: "contain",
    },
});
