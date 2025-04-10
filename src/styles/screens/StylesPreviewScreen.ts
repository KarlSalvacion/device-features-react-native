import { StyleSheet } from "react-native";

const stylesPreviewScreen = StyleSheet.create({
    container: {
        flex: 1,
    },
    previewContainer: {
        flex: 1,
    },
    previewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      zIndex: 1,
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
      fontWeight: 'bold',
    },
    backButton: {
      padding: 5,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',

    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    carouselDotContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
    },
    carouselDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginHorizontal: 3,
    },
    carouselDotActive: {
      backgroundColor: '#fff',
    },
    carouselCounter: {
      position: 'absolute',
      top: 20,
      right: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 20,
    },
    carouselCounterText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    actionButtons: {
      flexDirection: 'row',
      padding: 15,
      gap: 20,
      zIndex: 1,
    },
    actionButton: {
      padding: 5,
    },
    captionContainer: {
      padding: 12,
      paddingBottom: 20,
      zIndex: 1,
    },
    captionText: {
      fontSize: 14,
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
      fontStyle: 'italic',
    },
    footer: {
      padding: 16,
      alignItems: 'center',
      zIndex: 1,
      marginBottom: 50,
    },
    saveButton: {
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      width: '100%',
      flexDirection: 'row',
      gap: 10,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default stylesPreviewScreen;
