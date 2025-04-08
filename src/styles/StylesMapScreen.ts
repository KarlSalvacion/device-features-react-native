import { StyleSheet, Dimensions } from "react-native";

const stylesMapScreen = StyleSheet.create({
    container: {
        flex: 1,
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
    customCallout: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    calloutContainer: {
        width: 200,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    calloutImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    calloutTitle: {
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 4,
    },
    calloutAddress: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    }
});

export default stylesMapScreen;
