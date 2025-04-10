import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const stylesPostOptionsModal = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        height: '20%',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingBottom: 30,
        transform: [{ translateY: height }],
    },
    darkModalContent: {
        backgroundColor: '#2c2c2c',
    },
    optionButton: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        
    },
    darkDeleteButton: {
        borderBottomColor: '#3d3d3d',
    },
    pressedDeleteButton: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
    },
    deleteText: {
        color: '#ff3b30',
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: 8,
    },
    cancelText: {
        color: '#262626',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    darkCancelText: {
        color: '#ffffff',
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: '#dbdbdb',
        borderRadius: 2,
        alignSelf: 'center',
        marginVertical: 8,
    },
    darkIndicator: {
        backgroundColor: '#3d3d3d',
    },
    indicatorContainer: {
        width: '100%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default stylesPostOptionsModal; 