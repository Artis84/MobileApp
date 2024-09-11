import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { DrawerNavigationProp } from "@react-navigation/drawer";

export type RootStackParamList = {
    Root: undefined;
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    Verification: { popupAction: string; codeLengh: number };
    RefreshPassword: undefined;
};
// export type DrawerParamList = {
//     Tabs:undefined;
// }
export type BottomTabsParamList = {
    Home: undefined;
    Emotes: NavigatorScreenParams<EmotesStackParamList>;
    Create: undefined;
};

export type EmotesStackParamList = {
    EmotesScreen: undefined;
    SearchEmotesDetail: undefined;
};

export type HomeStackParamList = {
    HomeScreen: { newBanner: boolean; bannerMessage: string };
    Profile: undefined;
    CollectionEmotesDetail: undefined;
};

export type EmoteStackParamList = {
    CollectionEmotesDetailScreen: undefined;
    Edit: { emoteId: string };
};

export type StackScreenNavigationProp<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

// export type DrawerScreenNavigationProp = DrawerNavigationProp<DrawerParamList>

// export type BottomTabScreenNavigationProp<T extends keyof BottomTabsParamList> = BottomTabScreenProps<BottomTabsParamList, T>;

export type EmotesStackScreenNavigationProp<T extends keyof EmotesStackParamList> = NativeStackScreenProps<EmotesStackParamList, T>;

export type HomeStackScreenNavigationProp<T extends keyof HomeStackParamList> = NativeStackScreenProps<HomeStackParamList, T>;

export type CollectionEmotesNavigationProp<T extends keyof EmoteStackParamList> = NativeStackScreenProps<EmoteStackParamList, T>;

// export type EmotesScreenNavigationProps = CompositeScreenProps<BottomTabScreenProps<BottomTabsParamList>, NativeStackScreenProps<EmotesStackParamList>>;

export type HomeScreenNavigationProps = CompositeScreenProps<NativeStackScreenProps<HomeStackParamList, "HomeScreen">, BottomTabScreenProps<BottomTabsParamList>>;
