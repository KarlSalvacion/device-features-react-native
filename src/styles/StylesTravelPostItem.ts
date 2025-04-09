import { StyleSheet } from "react-native";

const stylesTravelPostItem = StyleSheet.create({

    entryContainer: {
        overflow: 'hidden',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    profilePic: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ddd',
        marginRight: 12,
    },
    profilePicImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    username: {
        fontSize: 14,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 12,
        marginTop: 2,
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    moreButton: {
        padding: 8,
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
    actionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 16,
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minWidth: 50,
    },
    likeCount: {
        fontSize: 14,
        fontWeight: '600',
    },
    actionButton: {
        padding: 2,
    },
    caption: {
        fontSize: 14,
        paddingHorizontal: 12,
        paddingBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: 8,
    },
    locationIcon: {
        marginRight: 4,
    },
    locationText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
});

export default stylesTravelPostItem; 