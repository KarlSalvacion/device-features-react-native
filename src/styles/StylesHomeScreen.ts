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
      borderBottomWidth: 1,
      borderBottomColor: "#dbdbdb",
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
    entryContainer: {
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#dbdbdb",
      backgroundColor: "white",
    },
    caption: {
      fontSize: 14,
      paddingHorizontal: 15,
      paddingBottom: 10,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingBottom: 15,
    },
    locationIcon: {
      marginRight: 4,
    },
    locationText: {
      fontSize: 12,
      fontStyle: 'italic',
    },
    location: {
      fontSize: 14,
      marginBottom: 10,
      color: "#8e8e8e",
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: 435,
      justifyContent: 'center',
      alignItems: 'center',
    },
    heartAnimationContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    image: {
      width: 435,
      height: 435,
      marginRight: 2,
    },
    removeButton: {
      position: "absolute",
      top: 10,
      right: 10,
      padding: 8,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderRadius: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyText: {
      fontSize: 18,
      textAlign: "center",
      color: "#8e8e8e",
    },
    addButton: {
      position: "absolute",
      bottom: 30,
      right: 30,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#0095f6",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
    },
    profilePic: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 10,
      backgroundColor: "#dbdbdb",
    },
    username: {
      fontWeight: "bold",
      fontSize: 14,
    },
    actionsContainer: {
      flexDirection: "row",
      padding: 12,
      paddingTop: 8,
    },
    actionButton: {
      marginRight: 16,
    },
  });

export default stylesHomeScreen;

