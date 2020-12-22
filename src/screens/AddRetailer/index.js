import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';

const CreateRetailer = () => {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={{ color: colors.text }}>Create Retailer</Text>
    </View>
  );
};

export default CreateRetailer;
