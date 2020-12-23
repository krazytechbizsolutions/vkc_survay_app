import React from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import ErrorScreen from '../errorScreen/ErrorScreen';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    crashlytics().recordError(error);
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorScreen />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
