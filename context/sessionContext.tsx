import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SessionContextType, ContextProviderProps } from "../types/context";

export const SessionContext = createContext({} as SessionContextType);

export const SessionProvider = ({ children }: ContextProviderProps) => {
    const [identifier, setIdentifier] = useState<string>("");
    const [emoteDetailIdentifier, setemoteDetailIdentifier] = useState<string>("");

    const setContextSessionId = (identifier: string) => {
        setIdentifier(identifier);
    };

    const setContextEmoteDetailId = (identifier: string) => {
        setemoteDetailIdentifier(identifier);
    };

    const setStorage = async (identifierKey: string, identifier: string) => {
        await AsyncStorage.setItem(identifierKey, identifier);
    };

    const removeStorage = async (identifierKey: string) => {
        await AsyncStorage.removeItem(identifierKey);
    };

    return <SessionContext.Provider value={{ setContextSessionId, setContextEmoteDetailId, setStorage, removeStorage, identifier, emoteDetailIdentifier }}>{children}</SessionContext.Provider>;
};
