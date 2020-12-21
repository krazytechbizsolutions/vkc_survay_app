import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
});

export default styles;
