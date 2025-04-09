import { StyleSheet, StatusBar } from "react-native";

const stylesGlobal = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});

export default stylesGlobal;

