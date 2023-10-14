import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { LocationObject } from "expo-location";
import React from "react";
import { StyleSheet } from "react-native";

import Main from "./components/screens/Main";
import Map from "./components/screens/Map";
import PositionList from "./components/screens/PositionList";

const Stack = createNativeStackNavigator();

export type NavigationStackParamList = {
    Main: undefined;
    PositionList: undefined;
    Map: { positions: LocationObject[] };
};
export type StackNavigation = NavigationProp<NavigationStackParamList>;

export default function App() {
    const [fontsLoaded] = useFonts({
        "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
                <Stack.Screen
                    name="PositionList"
                    component={PositionList}
                    options={{
                        headerTitle: "Zapis pozycji",
                        headerStyle: style.header,
                    }}
                />
                <Stack.Screen
                    name="Map"
                    component={Map}
                    options={{
                        headerTitle: "Lokalizacja na mapie",
                        headerStyle: style.header,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const style = StyleSheet.create({
    header: {
        backgroundColor: "rgb(66 80 175)",
    },
});
