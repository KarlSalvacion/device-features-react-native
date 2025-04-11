import { StyleSheet } from 'react-native';

const stylesSaveToGalleryModal = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 300,
    },

    indicatorContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    indicator: {
        width: 40,
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
    },
    darkIndicator: {
        backgroundColor: '#666',
    },
    contentContainer: {
        padding: 0,
    },
    optionsContainer: {
        gap: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        color: '#262626',
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    darkTitle: {
        color: '#fff',
    },
    optionButton: {
        marginHorizontal: 20,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'rgb(253, 253, 253)',
        gap: 10,
    },
    darkOptionButton: {
        backgroundColor: 'rgb(29, 29, 29)',
    },
    pressedOptionButton: {
        opacity: 0.7,
    },
    optionText: {
        fontSize: 16,
        color: '#262626',
    },
    darkOptionText: {
        color: '#fff',
    },
});

export default stylesSaveToGalleryModal; 