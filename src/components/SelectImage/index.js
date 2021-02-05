/* eslint-disable react/prop-types */
import TextEle from '@components/TextEle';
import React, { useEffect, useRef } from 'react';
import { FlatList, Image, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import RadioCheckedIcon from '../../assets/icons/radio_button_checked.svg';
import RadioUncheckedIcon from '../../assets/icons/radio_button_unchecked.svg';

const SelectImage = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
  data,
  valueField,
  imageField,
  textField,
  question,
}) => {
  const flastListRef = useRef();
  const onSelectValue = item => {
    setFieldTouched(name, true);
    setFieldValue(name, item);
  };

  useEffect(() => {
    if (!!(touched[name] && errors[name]) && flastListRef.current) {
      flastListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [touched, errors, name]);

  return (
    <>
      <TextEle variant="title">{question}</TextEle>
      {touched[name] && errors[name] && (
        <TextEle variant="caption" style={{ color: 'red', marginLeft: 5, marginVertical: 3 }}>
          {errors[name]}
        </TextEle>
      )}
      <FlatList
        ref={flastListRef}
        style={{ flex: 1 }}
        data={data}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, flex: 1, backgroundColor: 'black' }} />
        )}
        renderItem={({ item }) => (
          <RectButton onPress={() => onSelectValue(item)}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
              {value && value[valueField] && value[valueField] === item[valueField] ? (
                <RadioCheckedIcon fill="red" width={24} height={24} />
              ) : (
                <RadioUncheckedIcon fill="red" width={24} height={24} />
              )}
              <View style={{ paddingHorizontal: 20 }}>
                {item[imageField] && (
                  <Image
                    style={{ height: 500, width: 150 }}
                    source={{
                      uri: item[imageField],
                    }}
                  />
                )}
                {item[textField] && (
                  <TextEle style={{ textAlign: 'center', paddingVertical: 10 }}>
                    {item[textField]}
                  </TextEle>
                )}
              </View>
            </View>
          </RectButton>
        )}
        keyExtractor={(item, index) => `${item.Id}_${index}`}
      />
    </>
  );
};

export default SelectImage;
