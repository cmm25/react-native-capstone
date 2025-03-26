import React, { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/HOC/CustomButton";
import { AppContext, AppContextProps } from "@/context/AppContext";


// Define props interface for WelcomeScreen. Replace 'any' with a proper navigation type if available.
interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { globalState: { user } } = useContext(AppContext) as AppContextProps;

  return (
    <SafeAreaView
      style={styles.container}
    >
      <Text style={styles.text}>Welcome, {user?.firstName ? user.firstName : "Guest"}</Text>
      <CustomButton
        onPress={() => navigation.navigate("Profile")}
        text="Navigate to Profile"
      />
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center"
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
