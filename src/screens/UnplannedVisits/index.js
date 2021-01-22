import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';

const UnplannedVisits = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Unplanned Visit</Text>
    </View>
  );
};

export default UnplannedVisits;
