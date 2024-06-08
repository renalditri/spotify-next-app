"use client";
import { AccessToken } from "@spotify/web-api-ts-sdk";
import { ReactNode, createContext, useEffect, useState } from "react";

export type AuthContextValue = {
  accessToken: AccessToken | null;
  setToken: (newToken: AccessToken | null) => void;
} | null;

export const AuthContext = createContext<AuthContextValue>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<AccessToken | null>(null);

  useEffect(() => {
    checkStorage();
  }, []);

  const checkStorage = () => {
    const storageToken =
      localStorage.getItem("token") !== null
        ? (JSON.parse(localStorage.getItem("token") as string) as AccessToken)
        : null;
    setAccessToken(storageToken);
  };

  const setToken = (newToken: AccessToken | null) => {
    if (newToken === null) {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", JSON.stringify(newToken));
    }
    checkStorage();
  };

  const contextValue: AuthContextValue = {
    accessToken,
    setToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
