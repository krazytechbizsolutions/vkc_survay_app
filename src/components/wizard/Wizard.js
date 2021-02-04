/* eslint-disable operator-linebreak */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/prop-types */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Formik, Field, FieldArray } from 'formik';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Text from '../Text/Text';
import commonStyle from '../../commonStyle';
import Button from '../Button/Button';

export default class Wizard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: props.initialValues,
    };
  }

  next = values =>
    this.setState(state => ({
      page: Math.min(state.page + 1, this.props.fields.length - 1),
      values,
    }));

  previous = () =>
    this.setState(state => ({
      page: Math.max(state.page - 1, 0),
    }));

  // validate = values => {
  //   const activePage = React.Children.toArray(this.props.children)[this.state.page];
  //   return activePage.props.validate ? activePage.props.validate(values) : {};
  // };

  handleSubmit = (values, bag) => {
    const { fields, onSubmit } = this.props;
    const { page } = this.state;
    const isLastPage = page === fields.length - 1;
    if (isLastPage) {
      return onSubmit(values, bag);
    }
    bag.setTouched({});
    bag.setSubmitting(false);
    this.next(values);
  };

  render() {
    const { fields } = this.props;
    const { page, values } = this.state;
    const isLastPage = page === fields.length - 1;
    return (
      <Formik initialValues={values} enableReinitialize={false} onSubmit={this.handleSubmit}>
        {({ handleSubmit, isSubmitting, values, status, setFieldValue }) => (
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1 }}
            enabled={Platform.OS === 'ios'}
            keyboardVerticalOffset={88}>
            <>
              {status && status.serverError && (
                <Text variant="error" style={{ textAlign: 'center', margin: 10 }}>
                  {status.serverError}
                </Text>
              )}

              <ScrollView
                style={{ flex: 1, paddingVertical: 10 }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always">
                {fields.map((field, index) => {
                  if (page !== index) {
                    return null;
                  }
                  return (
                    <View key={index} style={commonStyle.mar10}>
                      {field.map(item => {
                        if (
                          item.onField &&
                          item.onValue &&
                          !item.onValue.split(',').includes(values[item.onField])
                        ) {
                          if (values[item.name] !== item.value) {
                            setFieldValue(item.name, item.value);
                          }
                          return;
                        }
                        if (item.fieldArray) {
                          return (
                            <FieldArray
                              key={item.name}
                              name={item.name}
                              render={arrayHelpers => (
                                <>
                                  {values[item.name].map((_, index) => (
                                    <View
                                      key={index}
                                      style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <View style={{ flex: 1 }}>
                                        {item.fieldArray.map(arr => (
                                          <Field
                                            key={arr.name}
                                            {...arr}
                                            name={`${item.name}[${index}].${arr.name}`}
                                          />
                                        ))}
                                      </View>
                                      <BorderlessButton
                                        style={{ marginLeft: 10 }}
                                        onPress={() => arrayHelpers.remove(index)}
                                      />
                                    </View>
                                  ))}
                                  {values[item.name].length < (item.maxLength || 3) && (
                                    <Button
                                      style={{ flex: 1, marginVertical: 8 }}
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
                        return <Field key={item.name} {...item} />;
                      })}
                    </View>
                  );
                })}
              </ScrollView>

              <View
                style={{
                  flexDirection: 'row',
                }}>
                {page > 0 && (
                  <Button
                    style={{ flex: 1, marginRight: 10 }}
                    viewStyle={{
                      paddingVertical: 10,
                      backgroundColor: '#ef4b4b',
                    }}
                    title="Previous"
                    textStyle={{ color: '#fff' }}
                    onPress={this.previous}
                  />
                )}

                {!isLastPage && (
                  <Button
                    style={{ flex: 1, marginLeft: page > 0 ? 10 : 0 }}
                    viewStyle={{
                      paddingVertical: 10,
                      backgroundColor: '#1caf91',
                    }}
                    title="Next"
                    textStyle={{ color: '#fff' }}
                    onPress={handleSubmit}
                  />
                )}
                {isLastPage && (
                  <Button
                    style={{ flex: 1 }}
                    viewStyle={{
                      paddingVertical: 10,
                      backgroundColor: '#1caf91',
                    }}
                    title="Submit"
                    textStyle={{ color: '#fff' }}
                    onPress={handleSubmit}
                    disable={isSubmitting}
                    loading={isSubmitting}
                  />
                )}
              </View>
            </>
          </KeyboardAvoidingView>
        )}
      </Formik>
    );
  }
}
