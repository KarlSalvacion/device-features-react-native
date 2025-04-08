import { StyleSheet, StatusBar } from "react-native";

const stylesGlobal = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
  },
});

export default stylesGlobal;

