import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import React from "react";

import Main from "./components/screens/Main";
import PositionList from "./components/screens/PositionList";

const Stack = createNativeStackNavigator();

export type NavigationStackParamList = {
    Main: undefined;
    PositionList: undefined;
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
                        headerStyle: {
                            backgroundColor: "rgb(66 80 175)",
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
