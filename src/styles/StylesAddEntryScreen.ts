import { StyleSheet } from "react-native";

const stylesAddEntryScreen = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },

    headerContainer: {
        backgroundColor: 'red',
        height: 60,
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    contentContainer: {
        backgroundColor: 'rgb(255, 255, 255)',
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
        marginLeft: 16,
        gap: 10,
        width: 150,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: "rgb(0, 0, 0)",
        borderRadius: 10,
        backgroundColor: "rgb(255, 255, 255)",
    },
    cameraButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgb(113, 113, 113)',
    },

    captureContainer: {
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255)',
    },

    imagePreviewContainer:{
        backgroundColor: "rgb(255, 255, 255)",
    },

    imagePreviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16,
        marginBottom: 10,
    },

    captionContainer: {
        height: "auto",
        backgroundColor: 'rgba(255, 255, 255)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
        marginBottom: 0,
    },

    captionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },

    captionInput: {
        paddingHorizontal: 16,
        fontSize: 16,
        borderRadius: 12,
        borderWidth: 1,
        height: 70,
        width: '100%',
        backgroundColor: 'transparent',
        marginBottom: 5,
    },
    
    locationContainer: {
        backgroundColor: 'rgb(255, 255, 255)',
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
        backgroundColor: 'rgb(245, 245, 245)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#dbdbdb',
    },
    imageCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#262626',
    },
    nextButton: {
        backgroundColor: '#0095f6',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
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