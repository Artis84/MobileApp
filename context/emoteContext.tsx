// import React, { createContext, useState } from "react";
// import { EmoteContextType, ContextProviderProps } from "../types/context";

// export const EmoteContext = createContext({} as EmoteContextType);

// export const SessionProvider = ({ children }: ContextProviderProps) => {
//     const [identifier, setIdentifier] = useState<string>("");

//     const setContextIdentifier = (identifier: string) => {
//         setIdentifier(identifier);
//     };

//     return <EmoteContext.Provider value={{ setContextIdentifier, identifier }}>{children}</EmoteContext.Provider>;
// };
