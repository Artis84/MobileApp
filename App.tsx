import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./screens/auth/Login";
import Home from "./screens/crud/Home";
import Create from "./screens/crud/Create";
import SignUp from "./screens/auth/SignUp";
import ForgotPassword from "./screens/auth/ForgotPassword";
import EmailVerification from "./screens/auth/EmailVerification";
import RefreshPassword from "./screens/auth/RefreshPassword";
import SearchEmotesDetail from "./screens/crud/SearchEmotesDetail";
import EmoteDetail from "./screens/crud/CollectionEmotesDetail";
import { SessionProvider } from "./context/sessionContext";
// import DefaultDrawer from "./components/DefaultDrawer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Config from "react-native-config";
import Emotes from "./screens/crud/Emotes";
import { RootStackParamList, EmotesStackParamList, EmoteStackParamList, BottomTabsParamList, HomeStackParamList } from "./types/navigation";
import Profile from "./screens/crud/Profile";
import CollectionEmotesDetail from "./screens/crud/CollectionEmotesDetail";
import Edit from "./screens/crud/Edit";

const client = new ApolloClient({
    uri: Config.GQL_END_POINT,
    cache: new InMemoryCache(),
});

const EmotesStack = createNativeStackNavigator<EmotesStackParamList>();
const EmoteStack = createNativeStackNavigator<EmoteStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<BottomTabsParamList>();
// const Drawer = createDrawerNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const EmotesStackScreen = () => {
    return (
        <EmotesStack.Navigator screenOptions={{ headerShown: false }}>
            <EmotesStack.Screen name="EmotesScreen" component={Emotes} />
            <EmotesStack.Screen name="SearchEmotesDetail" component={SearchEmotesDetail} />
        </EmotesStack.Navigator>
    );
};

const CollectionEmotesDetailtackScreen = () => {
    return (
        <EmoteStack.Navigator screenOptions={{ headerShown: false }}>
            <EmoteStack.Screen name="CollectionEmotesDetailScreen" component={CollectionEmotesDetail} />
            <EmoteStack.Screen name="Edit" component={Edit} />
        </EmoteStack.Navigator>
    );
};

const HomeStackScreen = () => {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="HomeScreen" component={Home} initialParams={{ newBanner: false, bannerMessage: "" }} />
            <HomeStack.Screen name="Profile" component={Profile} />
            <HomeStack.Screen name="CollectionEmotesDetail" component={CollectionEmotesDetailtackScreen} />
        </HomeStack.Navigator>
    );
};

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <Tab.Navigator screenOptions={{ headerShown: false }}>
                <Tab.Screen name="Home" component={HomeStackScreen} options={{ unmountOnBlur: true, tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} /> }} />
                <Tab.Screen
                    name="Emotes"
                    component={EmotesStackScreen}
                    options={{
                        unmountOnBlur: true,
                        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="emoticon-happy-outline" size={size} color={color} />,
                    }}
                />
                <Tab.Screen name="Create" component={Create} options={{ tabBarIcon: ({ color, size }) => <FontAwesomeIcon name="plus-square" size={size} color={color} /> }} />
            </Tab.Navigator>
        </ApolloProvider>
    );
};

// function Root() {
//     return (
//         <ApolloProvider client={client}>
//             <Drawer.Navigator drawerContent={DefaultDrawer} screenOptions={{ headerShown: false }}>
//                 <Drawer.Screen name="Tabs" component={Tabs} />
//             </Drawer.Navigator>
//         </ApolloProvider>
//     );
// }

const App = () => {
    return (
        <SessionProvider>
            <NavigationContainer>
                <RootStack.Navigator>
                    <RootStack.Screen name="Root" component={Root} options={{ headerShown: false }} />
                    <RootStack.Screen name="Login" component={Login} />
                    <RootStack.Screen name="SignUp" component={SignUp} />
                    <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
                    <RootStack.Screen name="Verification" component={EmailVerification} />
                    <RootStack.Screen name="RefreshPassword" component={RefreshPassword} />
                </RootStack.Navigator>
            </NavigationContainer>
        </SessionProvider>
    );
};

export default App;
