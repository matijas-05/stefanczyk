import { useNavigation } from "@react-navigation/native";
import { View, Image, StyleSheet, Text } from "react-native";

import Button from "./Button";

interface Props {
    index: number;
    fetchUsers: () => void;
    user: UserType;
}

export default function User(props: Props) {
    const navigation = useNavigation();

    return (
        <View style={styles.user}>
            <View>
                <Image style={styles.userImage} source={require("../assets/user.png")} />
            </View>
            <View style={styles.userDetails}>
                <View style={styles.userButtons}>
                    <Button
                        title="DETAILS"
                        style={styles.userButton}
                        onPress={() => navigation.navigate("Details", { user: props.user })}
                    />
                    <Button
                        title="DELETE"
                        style={styles.userButton}
                        onPress={async () => {
                            await fetch(
                                `${process.env.EXPO_PUBLIC_API_URL}/users/${props.user.login}`,
                                {
                                    method: "DELETE",
                                },
                            );
                            props.fetchUsers();
                        }}
                    />
                </View>
                <Text style={styles.userText}>
                    {props.index}: {props.user.login}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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

export interface UserType {
    login: string;
    password: string;
    date: string;
}
