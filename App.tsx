import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import { Database } from "./Database";
import AddAlarm from "./components/screens/AddAlarm";
import AlarmList from "./components/screens/AlarmList";
import Splash from "./components/screens/Splash";

const Stack = createNativeStackNavigator();

export type NavigationParamMap = {
    AlarmList: undefined;
    AddAlarm: undefined;
};
export type Navigation = NavigationProp<NavigationParamMap>;

export default function App() {
    const [fontsLoaded] = useFonts({
        "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    });

    useEffect(() => {
        Database.init();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                <Stack.Screen
                    name="AlarmList"
                    component={AlarmList}
                    options={{
                        headerTitle: "lista budzików",
                        headerStyle: style.header,
                    }}
                />
                <Stack.Screen
                    name="AddAlarm"
                    component={AddAlarm}
                    options={{
                        headerTitle: "dodaj budzik",
                        headerStyle: style.header,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const style = StyleSheet.create({
    header: {
        backgroundColor: "#512da7",
    },
});
