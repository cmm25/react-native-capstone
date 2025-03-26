import React from "react";
import {
  Pressable,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  PressableProps,
} from "react-native";
import { colors } from "../../../constants/Colors";

interface CustomButtonProps extends PressableProps {
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  style,
  textStyle,
  ...args
}) => {
  return (
    <Pressable
      style={[
        {
          padding: 15,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.GREEN,
          borderColor: colors.GREEN,
          borderWidth: 2,
        },
        style,
      ]}
      {...args}
    >
      <Text
        style={[
          {
            color: colors.GRAY,
            justifyContent: "center",
            fontWeight: "bold",
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default CustomButton;
