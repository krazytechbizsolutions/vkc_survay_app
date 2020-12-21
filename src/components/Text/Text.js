import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Text as RNText } from 'react-native';
import styles from './styles';

const Text = ({ children, variant, style, ...props }) => {
  return (
    <RNText style={[styles[variant], style]} {...props} allowFontScaling={false}>
      {children}
    </RNText>
  );
};

Text.propTypes = {
  variant: PropTypes.oneOf([
    'body',
    'title',
    'error',
    ' inlineError',
    'button',
    'header',
    'header1',
    'header2',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'label',
  ]),
};

Text.defaultProps = {
  variant: 'body',
};

export default memo(Text);
