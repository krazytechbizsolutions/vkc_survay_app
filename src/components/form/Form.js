/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
/* eslint-disable react-native/no-inline-styles */
import React, { memo } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView, BorderlessButton } from 'react-native-gesture-handler';
import { Formik, Field, FieldArray } from 'formik';
import Text from '../Text/Text';
import Button from '../Button/Button';
import RemoveCircle from '../../assets/icons/remove_circle.svg';

const Form = ({
  fields,
  innerRef,
  disable,
  buttonText,
  cancelButton,
  disableKAV,
  hideArrBtn,
  hideArrRemove,
  ...props
}) => (
  <Formik ref={innerRef} {...props}>
    {({ handleSubmit, isSubmitting, status, values }) => (
      <>
        {status && status.serverError && (
          <Text variant="error" style={{ textAlign: 'center', margin: 10 }}>
            {status.serverError}
          </Text>
        )}
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1 }}
          enabled={Platform.OS === 'ios' && !disableKAV}
          keyboardVerticalOffset={64}>
          <ScrollView
            style={{ flex: 1, marginHorizontal: 10 }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always">
            {fields.map(item => {
              if (
                item.onField &&
                item.onValue &&
                !item.onValue.split(',').includes(`${values[item.onField]}`)
              ) {
                return;
              }
              if (item.fieldArray && values[item.name]) {
                return (
                  <FieldArray
                    key={item.name}
                    name={item.name}
                    render={arrayHelpers => (
                      <>
                        {values[item.name].map((_, index) => (
                          <View
                            key={index}
                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[{ flex: 1 }, item.containerStyle]}>
                              {item.fieldArray.map(arr => {
                                let { options } = arr;
                                if (arr.options && arr.isUnique) {
                                  const selectedValues = values[item.name].reduce(
                                    (p, c) => [...p, c[arr.name]],
                                    [],
                                  );
                                  options = arr.options.filter(
                                    x => !selectedValues.includes(x.value),
                                  );
                                }
                                return (
                                  <Field
                                    key={arr.name}
                                    {...arr}
                                    disable={item.disable || arr.disable}
                                    name={`${item.name}[${index}].${arr.name}`}
                                    mapField={
                                      arr.mapField && `${item.name}.${index}.${arr.mapField}`
                                    }
                                    options={options}
                                  />
                                );
                              })}
                            </View>
                            {!item.disable && !item.hideArrRemove && !hideArrRemove && (
                              <BorderlessButton
                                style={{ marginLeft: 10 }}
                                onPress={() => arrayHelpers.remove(index)}>
                                <RemoveCircle
                                  width={24}
                                  height={24}
                                  style={{ color: 'rgb(0, 112, 210)' }}
                                />
                              </BorderlessButton>
                            )}
                          </View>
                        ))}
                        {!disable && !item.disable && !item.hideArrBtn && !hideArrBtn && (
                          <Button
                            style={{ flex: 1, marginVertical: 10 }}
                            viewStyle={{
                              paddingVertical: 10,
                              backgroundColor: '#ef4b4b',
                            }}
                            title={item.buttonTitle}
                            textStyle={{ color: '#fff' }}
                            onPress={() => arrayHelpers.push(item.addObject)}
                          />
                        )}
                      </>
                    )}
                  />
                );
              }
              return <Field key={item.name} disable={disable} {...item} />;
            })}
          </ScrollView>
        </KeyboardAvoidingView>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {!!cancelButton && (
            <View
              style={{
                flex: 1,
                marginRight: 5,
              }}>
              <Button
                viewStyle={{
                  paddingVertical: 10,
                  backgroundColor: '#ef4b4b',
                }}
                textStyle={{ color: '#fff' }}
                {...cancelButton}
              />
            </View>
          )}
          <View
            style={{
              flex: 1,
            }}>
            <Button
              viewStyle={{
                paddingVertical: 10,
                backgroundColor: '#1caf91',
              }}
              title={buttonText || 'Submit'}
              textStyle={{ color: '#fff' }}
              loading={isSubmitting}
              disable={isSubmitting || disable}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </>
    )}
  </Formik>
);

export default memo(Form);
