import { StyleSheet } from "react-native";

const stylesHomeScreen = StyleSheet.create({
  container: {
    flex: 1,
  },
   header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    shadowColor: "#000",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  themeButton: {
    padding: 10,
  },
  listContainer: {
    padding: 0,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#ff0000',
  },
  emptyIcon:{
    marginTop: -100,
    marginBottom: 20,
    fontSize: 100,
    color: "#8e8e8e",
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    color: "#8e8e8e",
  },
});

export default stylesHomeScreen;

