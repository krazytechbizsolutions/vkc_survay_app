import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBW: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  hPad10: {
    paddingHorizontal: 10,
  },
  vPad10: {
    paddingVertical: 10,
  },
  hPad20: {
    paddingHorizontal: 10,
  },
  vPad20: {
    paddingVertical: 20,
  },
  pad10: {
    padding: 10,
  },
  pad20: {
    padding: 20,
  },
  hMar10: {
    marginHorizontal: 10,
  },
  vMar10: {
    marginVertical: 10,
  },
  hMar20: {
    marginHorizontal: 20,
  },
  vMar20: {
    marginVertical: 20,
  },
  mar10: {
    margin: 10,
  },
  bgColor: { backgroundColor: '#fff' },
});

export default styles;
