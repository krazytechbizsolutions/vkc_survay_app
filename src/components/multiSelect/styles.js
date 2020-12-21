import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  loadingStyle: { flex: 1, paddingTop: 20 },
  textInputStyle: {
    textAlign: 'center',
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#000',
    borderRadius: 7,
    backgroundColor: '#fff',
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 5,
  },
  listStyle: { marginTop: 10 },
  lineStyle: {
    borderBottomColor: '#A2A2A2',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    color: '#7d7d7d',
    fontSize: 14,
    paddingHorizontal: 10,
    height: 40,
    borderColor: '#d2d2d2',
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 12,
    color: 'red',
    lineHeight: 16,
  },
  errorBorder: {
    borderColor: 'red',
  },
  modal: {
    backgroundColor: '#FFF',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
  },
  textInputCancelStyle: { right: 6, zIndex: 1, position: 'absolute' },
  cancelButtonStyle: {
    marginLeft: 5,
  },
  selectContainer: { marginBottom: 10 },
});

export default styles;
