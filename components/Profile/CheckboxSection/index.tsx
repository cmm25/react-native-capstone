import Checkbox from 'expo-checkbox';
import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../../constants/Colors';

interface CheckBoxSectionProps
  extends Omit<React.ComponentProps<typeof Checkbox>, 'value' | 'onValueChange' | 'disabled' | 'style'> {
  text: string;
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
}

const CheckBoxSection: React.FC<CheckBoxSectionProps> = ({
  text,
  value,
  disabled,
  onValueChange,
  ...rest
}) => {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <Checkbox
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
        color={colors.GREEN} 
        style={{
        height: 20,
        width: 20,
        }}
        {...rest}
      />

      <Text>{text}</Text>
    </View>
  );
};

export default CheckBoxSection;
