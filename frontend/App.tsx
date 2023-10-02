import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Main from "./components/screens/Main";
import Users from "./components/screens/Users";

const Stack = createNativeStackNavigator();
export type NavigationStackParamList = {
    Main: undefined;
    Users: undefined;
    Details: { login: string };
};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
                <Stack.Screen
                    name="Users"
                    component={Users}
                    options={{
                        headerStyle: {
                            backgroundColor: "green",
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
