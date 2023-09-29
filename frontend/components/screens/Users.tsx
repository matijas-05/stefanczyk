import React, { useEffect } from "react";
import { View, Text } from "react-native";

import { URL } from "../../App";

export default function Users() {
    useEffect(() => {
        (async () => {
            const res = await fetch(`${URL}/users`);
            alert(JSON.stringify(await res.json()));
        })();
    }, []);

    return (
        <View>
            <Text>Users</Text>
        </View>
    );
}
