import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';

const UnplannedVisit = () => {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={{ color: colors.text }}>Unplanned Visit</Text>
    </View>
  );
};

export default UnplannedVisit;
