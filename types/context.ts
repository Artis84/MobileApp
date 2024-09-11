export type SessionContextType = {
    identifier: string;
    emoteDetailIdentifier: string;
    setContextSessionId: (identifier: string) => void;
    setContextEmoteDetailId: (identifier: string) => void;
    setStorage: (key: string, value: string) => Promise<void>;
    removeStorage: (key: string) => Promise<void>;
};

export type ContextProviderProps = {
    children: React.ReactNode;
};
