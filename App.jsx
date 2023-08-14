import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import ForgotPassword from "./screens/ForgotPassword";
import EmailVerification from "./screens/EmailVerification";
import RefreshPassword from "./screens/RefreshPassword";

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Forgot Password" component={ForgotPassword} />
                <Stack.Screen name="Verification" component={EmailVerification} />
                <Stack.Screen name="RefreshPassword" component={RefreshPassword} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
