import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import EmailVerification from "./screens/EmailVerification";

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="EmailVerification" component={EmailVerification} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
