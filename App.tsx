import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { Asset } from "expo-media-library";
import React from "react";
import { StyleSheet } from "react-native";

import Camera from "./components/screens/Camera";
import Gallery from "./components/screens/Gallery";
import Photo from "./components/screens/Photo";
import SplashScreen from "./components/screens/SplashScreen";

const Stack = createNativeStackNavigator();

export type NavigationParamMap = {
    Main: undefined;
    Gallery: undefined;
    Photo: { asset: Asset };
    Camera: undefined;
};
export type Navigation = NavigationProp<NavigationParamMap>;

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
                <Stack.Screen
                    name="Photo"
                    component={Photo}
                    options={{
                        headerTitle: "Wybrane zdjęcie",
                        headerStyle: style.header,
                    }}
                />
                <Stack.Screen
                    name="Camera"
                    component={Camera}
                    options={{
                        headerTitle: "Kamera",
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
