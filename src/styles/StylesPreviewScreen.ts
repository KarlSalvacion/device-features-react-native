import { StyleSheet } from "react-native";

const stylesPreviewScreen = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    previewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#333',
    },
    previewUserInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    userAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 10,
    },
    username: {
      color: '#fff',
      fontWeight: 'bold',
    },
    backButton: {
      padding: 5,
    },
    headerTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 1,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    actionButtons: {
      flexDirection: 'row',
      padding: 15,
      gap: 20,
    },
    actionButton: {
      padding: 5,
    },
    captionContainer: {
      padding: 12,
      paddingBottom: 20,
    },
    captionText: {
      fontSize: 14,
      color: '#fff',
      marginBottom: 8,
    },
    locationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    locationIcon: {
      marginRight: 4,
    },
    locationText: {
      fontSize: 12,
      color: '#ccc',
      fontStyle: 'italic',
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: '#333',
      padding: 16,
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: '#0095f6',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default stylesPreviewScreen;
