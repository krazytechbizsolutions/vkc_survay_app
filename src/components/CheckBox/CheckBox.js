import React from 'react';
import CheckboxIcon from '../../assets/icons/check_box.svg';
import CheckboxOutline from '../../assets/icons/check_box_outline.svg';

const Checkbox = ({ checked }) => {
  if (checked) {
    return <CheckboxIcon width={24} height={24} />;
  }
  return <CheckboxOutline width={24} height={24} />;
};

export default Checkbox;
