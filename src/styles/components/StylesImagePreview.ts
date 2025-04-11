import { StyleSheet } from "react-native";

const stylesImagePreview = StyleSheet.create({
    imageScrollView: {
        flexGrow: 0,
        flexShrink: 0,
    },
    
    imageContainer: {
        width: 160,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 8,
    },

    removeButton: {
        zIndex: 1,
        marginBottom: -20,
        alignSelf: "flex-end",
        backgroundColor: 'rgb(29, 29, 29)',
        borderRadius: 100,
        padding: 0,
    },

    removeButtonIcon: {
        fontSize: 24,
        color: "white",
    }
  });

export default stylesImagePreview;
