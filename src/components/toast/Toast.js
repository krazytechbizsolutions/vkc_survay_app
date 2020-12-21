import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Text, Animated, ToastAndroid } from 'react-native';
import { OS } from '../../utils';

type Props = {};
type State = {};

const styles = StyleSheet.create({
  animatedToastView: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
    zIndex: 9999,
    position: 'absolute',
    alignSelf: 'center',
  },

  toastBoxInsideText: {
    fontSize: 15,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});

class index extends PureComponent<Props, State> {
  constructor() {
    super();
    this.animateOpacityValue = new Animated.Value(0);
    this.state = {
      showToast: false,
    };
    this.toastMessage = '';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.toastMsg && nextProps.toastMsg.notification) {
      if (OS === 'ios') {
        this.showToastMsg(nextProps.toastMsg.notification);
      } else {
        ToastAndroid.show(nextProps.toastMsg.notification, 4000);
      }
    }
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearTimeout(this.timerID);
    }
  }

  showToastMsg = (message, duration = 4000) => {
    this.ToastMessage = message;
    this.setState({ showToast: true }, () => {
      Animated.timing(this.animateOpacityValue, {
        toValue: 1,
        duration: 500,
      }).start(this.hideToastMsg(duration));
    });
  };

  hideToastMsg = duration => {
    this.timerID = setTimeout(() => {
      Animated.timing(this.animateOpacityValue, {
        toValue: 0,
        duration: 500,
      }).start(() => {
        this.setState({ showToast: false });
        clearTimeout(this.timerID);
      });
    }, duration);
  };

  render() {
    const { backgroundColor, textColor } = this.props;
    const { showToast } = this.state;
    if (showToast && OS === 'ios') {
      return (
        <Animated.View
          style={[
            styles.animatedToastView,
            {
              opacity: this.animateOpacityValue,
              top: '80%',
              backgroundColor,
            },
          ]}
        >
          <Text numberOfLines={1} style={[styles.toastBoxInsideText, { color: textColor }]}>
            {this.ToastMessage}
          </Text>
        </Animated.View>
      );
    }
    return null;
  }
}
index.propTypes = {
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  notification: PropTypes.string,
  toastMsg: PropTypes.object.isRequired,
};

index.defaultProps = {
  backgroundColor: '#666666',
  textColor: '#fff',
  notification: '',
};
function mapStateToProps(state) {
  return {
    toastMsg: state.toastMsg,
  };
}

export default connect(
  mapStateToProps,
  null,
)(index);
