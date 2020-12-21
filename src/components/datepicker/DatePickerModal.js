/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { DatePickerIOS, View, Text, Modal } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import styles from './styles';

const DatePicker = ({ visible, onClose, onSelect }) => {
  const [chosenDate, setChosenDate] = useState(new Date());
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.flexEnd}>
        <View style={{ backgroundColor: '#efefef' }}>
          <View style={styles.spaceBW}>
            <TouchableWithoutFeedback
              onPress={onClose}
              underlayColor="#808080"
              style={{ paddingHorizontal: 8 }}
            >
              <Text style={styles.cancelText}>{'Cancel'}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => onSelect(chosenDate)}
              underlayColor="#808080"
              style={{ paddingHorizontal: 8 }}
            >
              <Text style={styles.submitText}>{'Submit'}</Text>
            </TouchableWithoutFeedback>
          </View>
          <DatePickerIOS
            date={chosenDate}
            mode="date"
            minimumDate={new Date()}
            onDateChange={newDate => setChosenDate(newDate)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default DatePicker;
