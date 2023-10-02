import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import { NavigationStackParamList } from "../../App";
import Button from "../Button";
import User, { UserType } from "../User";

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
            <Button title="BACK TO LOGIN PAGE" onPress={() => props.navigation.navigate("Main")} />
            <FlatList
                data={users}
                renderItem={({ item: user, index }) => (
                    <User user={user} index={index} fetchUsers={fetchUsers} {...props} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        gap: 16,
    },
});
