import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../components/Profile/CustomTextInput";
import { AppContext, AppContextProps } from "../context/AppContext";
import { colors } from "../constants/Colors";
import CustomButton from "../components/HOC/CustomButton";
import CheckBoxSection from "../components/Profile/CheckboxSection";
import Avatar from "../components/Avatar/Avatar";
import resetApp from "../utils/resetApp";
import { StackNavigationProp } from "@react-navigation/stack";

// Define your navigator's parameter list
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  // add other screens if needed
};

// Define the navigation prop type for ProfileScreen
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, "Profile">;

interface NotificationPrefState {
  orderStatus: boolean;
  password: boolean;
  offers: boolean;
  newsletter: boolean;
}

const initalNotificationPrefState: NotificationPrefState = {
  orderStatus: true,
  password: true,
  offers: true,
  newsletter: true,
};

interface User {
  firstName: string;
  lastName?: string | null;
  email: string;
  phoneNumber?: string | null;
  notificationPref?: NotificationPrefState;
}

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [notificationPref, setNotificationPref] = useState<NotificationPrefState>(
    initalNotificationPrefState
  );

  const { logOut, updateUser, globalState, setOnboardingCompleted } =
    useContext(AppContext) as AppContextProps;

  const { user } = globalState;

  const setProfileValues = async (userAsyncStorage: User): Promise<void> => {
    const { firstName, email, lastName, phoneNumber, notificationPref } = userAsyncStorage;
    setFirstName(firstName);
    setLastName(lastName || null);
    setEmail(email);
    setPhoneNumber(phoneNumber || null);
    setNotificationPref(notificationPref || initalNotificationPrefState);
  };

  const loadProfileData = async (): Promise<void> => {
    try {
      const jsonString = await AsyncStorage.getItem("user");
      if (!jsonString) return;
      await setProfileValues(JSON.parse(jsonString));
    } catch (error) {
      console.log("Error loading profile data:", error);
    }
  };

  const isValidPhoneNumber = (input: string): boolean => {
    // US only phone number regex
    const phonePattern = /^(\+1)?[0-9]{3}[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/;
    return phonePattern.test(input);
  };

  const saveProfileChanges = async (): Promise<void> => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      alert("Invalid phone number");
      return;
    }
    setOnboardingCompleted(true);
    try {
      await updateUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        notificationPref,
      });
      navigateToHomeScreen();
    } catch (error) {
      alert("Error saving profile changes");
      console.error(error);
    }
  };

  const discardProfileChanges = async (): Promise<void> => {
    await loadProfileData();
    alert("Changes discarded");
  };

  const changeNotificationPref = (
    key: keyof NotificationPrefState,
    value: boolean
  ): void => {
    setNotificationPref((prev) => ({ ...prev, [key]: value }));
  };

  const navigateToHomeScreen = (): void => navigation.replace("Home");

  useEffect(() => {
    loadProfileData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView>
        <View style={{ padding: 20, flex: 1, gap: 10 }}>
          <Text style={{ fontWeight: "600", fontSize: 20, color: colors.BLACK }}>
            Personal Information
          </Text>
          {/* Avatar Section */}
          <Avatar />
          {/* Personal Information Section */}
          <CustomTextInput
            label="First name"
            value={firstName ?? ""}
            onChangeText={setFirstName}
          />
          <CustomTextInput
            label="Last name"
            value={lastName ?? ""}
            placeholder="Doe..."
            onChangeText={setLastName}
          />
          <CustomTextInput
            label="Email"
            value={email ?? ""}
            onChangeText={setEmail}
            inputMode="email"
            keyboardType="email-address"
          />
          <CustomTextInput
            label="Phone number"
            value={phoneNumber ?? ""}
            placeholder="(000) 000-0000"
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
          />
          {/* Notification Section */}
          <Text style={{ fontWeight: "600", fontSize: 15, color: colors.BLACK }}>
            Email notifications
          </Text>
          {/* Checkbox Section */}
          <View style={{ flexDirection: "column", gap: 15 }}>
            <CheckBoxSection
              text="Order status"
              value={notificationPref.orderStatus}
              onValueChange={(value) => changeNotificationPref("orderStatus", value)}
            />
            <CheckBoxSection
              text="Password changes"
              value={notificationPref.password}
              onValueChange={(value) => changeNotificationPref("password", value)}
            />
            <CheckBoxSection
              text="Special offers"
              value={notificationPref.offers}
              onValueChange={(value) => changeNotificationPref("offers", value)}
            />
            <CheckBoxSection
              text="Newsletter"
              value={notificationPref.newsletter}
              onValueChange={(value) => changeNotificationPref("newsletter", value)}
            />
          </View>
          <CustomButton
            text="Log out"
            style={{
              backgroundColor: colors.YELLOW,
              borderColor: colors.YELLOW,
            }}
            textStyle={{ color: colors.BLACK }}
            onPress={logOut}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              gap: 20,
            }}
          >
            <CustomButton
              text="Discard Changes"
              onPress={discardProfileChanges}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: colors.GREEN,
              }}
              textStyle={{ color: colors.BLACK }}
            />
            <CustomButton text="Save Changes" onPress={saveProfileChanges} />
          </View>
          <CustomButton
            text="RESET APP"
            onPress={resetApp}
            style={{
              backgroundColor: "red",
              borderWidth: 0,
              width: 200,
              alignSelf: "center",
              marginTop: 10,
            }}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
