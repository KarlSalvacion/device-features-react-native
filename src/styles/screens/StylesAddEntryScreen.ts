import { StyleSheet } from "react-native";

const stylesAddEntryScreen = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },

    headerContainer: {
        backgroundColor: '#0095f6',
        height: 50,
        width: '100%',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'left',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    clearButtonText: {
        fontSize: 14,
        marginLeft: 4,
    },
    captionInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    clearCaptionButton: {
        position: 'absolute',
        right: 10,
        padding: 5,
    },
    captionInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 5,
        fontSize: 14,
    },
    contentContainer: {
        
        paddingVertical: 10,
    },

    imageContainer: {
        marginRight: 10,
        position: "relative",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 2,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },

    saveButton: {
        backgroundColor: "#0095f6",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: "auto",
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },

    captureButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
    },
    cameraButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },

    captureContainer: {
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255)',
    },

    imagePreviewContainer:{

    },

    imagePreviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16,
        marginBottom: 10,
    },

    captionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    captionContainer: {
        height: "auto",
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
        marginBottom: 0,
    },

    captionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },

    locationContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
        marginTop: 0,
    },
    
    locationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    
    locationTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        gap: 5,
    },
    
    locationButtonText: {
        fontSize: 14,
        color: 'rgb(113, 113, 113)',
    },
    
    locationDetails: {
        backgroundColor: 'rgb(245, 245, 245)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    
    locationAddress: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    
    locationCoordinates: {
        fontSize: 12,
        color: 'rgb(113, 113, 113)',
    },
    
    footer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        gap: 10,
    },
    imageCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#262626',
    },
    nextButton: {
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    footerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cameraButton: {
        padding: 10,
        marginRight: 15,
    },
});

export default stylesAddEntryScreen; 