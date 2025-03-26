import React, { createContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface GlobalState {
  isOnboardingCompleted: boolean;
  user?: any; // Replace 'any' with a proper type if available
}

export interface AppContextProps {
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
  setOnboardingCompleted: (value?: boolean) => Promise<void>;
  logOut: () => Promise<void>;
  getUser: () => Promise<any | void>;
  updateUser: (userObject: any) => Promise<any | void>;
}

export const AppContext = createContext<AppContextProps | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const initialState: GlobalState = {
    isOnboardingCompleted: false,
  };

  const [globalState, setGlobalState] = useState<GlobalState>(initialState);

  const setOnboardingCompleted = async (value: boolean = true): Promise<void> => {
    setGlobalState((prev) => ({
      ...prev,
      isOnboardingCompleted: value,
    }));
  };

  const logOut = async (): Promise<void> => {
    await AsyncStorage.removeItem("user");
    await setOnboardingCompleted(false);
  };

  const getUser = async (): Promise<any | void> => {
    const userString = await AsyncStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setGlobalState((prev) => ({
        ...prev,
        user,
      }));
      return user;
    }
  };

  const updateUser = async (userObject: any): Promise<any | void> => {
    if (userObject) {
      const userString = (await AsyncStorage.getItem("user")) || "{}";
      const parsedUser = JSON.parse(userString);
      const updatedUser = { ...parsedUser, ...userObject };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      setGlobalState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
      return updatedUser;
    }
  };

  return (
    <AppContext.Provider
      value={{
        globalState,
        setGlobalState,
        setOnboardingCompleted,
        logOut,
        getUser,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
