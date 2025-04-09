import { StyleSheet } from "react-native";

const stylesNavigation = StyleSheet.create({
    navigationContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: '',
        height: 65,
        width: "100%",
        alignSelf: "center",
        position: 'relative',
    },  

    tabBarButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',  
        marginHorizontal: 0,
        marginVertical: 0,
    },

    tabBarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 65,
        width: '100%',
    },

    tabBarButtonPressed: {
        backgroundColor: 'transparent',
    },

    tabBarIcon: {
        fontSize: 30,
    },

    activeTabBarIcon: {
        color: 'black',
    },

    tabBarText: {
        textAlign: 'center',
        fontSize: 12,
        color: 'black',
    },

    indicator: {
        position: 'absolute',
        top: 0,
        height: 3,
        width: '33.33%',
    },
});

export default stylesNavigation;
