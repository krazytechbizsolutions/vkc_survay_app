import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    borderColor: '#4A4A4A',
    paddingHorizontal: 10,
  },
  errorBorder: {
    borderColor: 'red',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 10,
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
  modal: {
    backgroundColor: '#FFF',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
  },
  textInputCancelStyle: { right: 6, zIndex: 10, position: 'absolute' },
  cancelButtonStyle: {
    marginLeft: 5,
  },
  selectContainer: { marginBottom: 10 },
  //   textIcon: {
  //     position: 'absolute',
  //     ...Platform.select({
  //       ios: {
  //         right: 10,
  //         top: 10,
  //       },
  //       android: {
  //         right: 10,
  //         top: 30,
  //       },
  //     }),
  //   },

  flexEnd: { flex: 1, justifyContent: 'flex-end' },
  spaceBW: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderTopColor: '#ccc',
  },
  spaceClose: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelText: { fontSize: 14, padding: 16, color: '#808080' },
  submitText: { fontSize: 14, padding: 16, color: '#2b66b1' },
  buttonOne: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#cfcfcf',
    marginHorizontal: 30,
    marginVertical: 20,
    paddingVertical: 10,
  },
  buttonOnePress: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#303542',
    marginHorizontal: 30,
    marginVertical: 20,
    paddingVertical: 10,
  },
  buttonTwo: {
    borderColor: '#cfcfcf',
    borderWidth: 1,
    borderRadius: 2,
    marginHorizontal: 30,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressTwo: {
    borderColor: '#303542',
    borderWidth: 1,
    borderRadius: 2,
    marginHorizontal: 30,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
