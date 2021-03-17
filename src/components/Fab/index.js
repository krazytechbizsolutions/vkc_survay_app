import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';
import Storefront from '../../assets/icons/Storefront.svg';
import GroupAdd from '../../assets/icons/GroupAdd.svg';

const actionItem = [
  {
    path: 'AddRetailer',
    title: 'Create Retailer',
    icon: <Storefront width={30} height={30} fill="black" />,
    type: 'Create',
  },
  {
    path: 'AddUnplannedVisits',
    title: 'Unplanned Visit',
    icon: <GroupAdd width={30} height={30} fill="black" />,
    type: 'Create',
  },
];

const Fab = ({ onClick }) => (
  <ActionButton size={50} buttonColor="#79a4eb" backgroundTappable={false}>
    {actionItem.map(item => (
      <ActionButton.Item
        key={item}
        buttonColor="#fff"
        textStyle={{ color: '#000' }}
        onPress={() => onClick(item.path)}
        {...item}>
        {item.icon}
      </ActionButton.Item>
    ))}
  </ActionButton>
);
Fab.propTypes = {
  onClick: PropTypes.func.isRequired,
};
export default memo(Fab);
