import { StyleSheet } from "react-native";

const stylesNavigation = StyleSheet.create({
    navigationContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor:  '',
        height: 65,
        width: "100%",
        alignSelf: "center",
    },  

    tabBarButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',  
        marginHorizontal: 20,
        marginVertical: 0,

    },

    tabBarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },

    tabBarButtonPressed:{
        backgroundColor: 'transparent',
    },

    tabBarIcon: {
        fontSize: 24,
        color: 'black',
    },

    activeTabBarIcon: {
        color: 'red',
    },

    tabBarText: {
        textAlign: 'center',
        fontSize: 12,
        color: 'black',
    },
});

export default stylesNavigation;
