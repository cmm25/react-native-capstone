import React from "react";
import { View } from "react-native";
import Header from "../components/Header/Header";

const SplashScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Header />
    </View>
  );
};

export default SplashScreen;
