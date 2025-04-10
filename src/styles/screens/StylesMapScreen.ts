import { StyleSheet, Dimensions } from "react-native";

const stylesMapScreen = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: 60,
        width: '100%',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    calloutContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        width: 200,
    },
    calloutCaption: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",

    },
    calloutDate: {
        fontSize: 14,
        color: "#555",
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      
      thumbnailMarker: {
        width: 70,
        height: 70,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: '#ddd',
      },
      
      thumbnailImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      },
      
      arrowDown: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'rgb(255, 255, 255)', 
        marginTop: -1, 
      },
      
      
});

export default stylesMapScreen;
