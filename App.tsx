import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import React from "react";
import { StyleSheet } from "react-native";

import Gallery from "./components/screens/Gallery";
import SplashScreen from "./components/screens/SplashScreen";

const Stack = createNativeStackNavigator();

export type NavigationStackParamList = {
    Main: undefined;
    Gallery: undefined;
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
                <Stack.Screen
                    name="SplashScreen"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Gallery"
                    component={Gallery}
                    options={{
                        headerTitle: "Zdjęcia z folderu DCIM",
                        headerStyle: style.header,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const style = StyleSheet.create({
    header: {
        backgroundColor: "#EA1E63",
    },
});
