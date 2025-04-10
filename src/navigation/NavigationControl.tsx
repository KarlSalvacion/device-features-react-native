import React, { useRef, useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../context/ThemeContext";
import HomeScreen from '../screens/HomeScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import MapScreen from '../screens/MapScreen';
import PreviewScreen from '../screens/PreviewScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { RootTabParamList } from './NavigationType';
import stylesNavigation from "../styles/navigation/StylesNavigation";

export type AddEntryStackParamList = {
  Camera: undefined;
  Preview: {
    images: string[];
    caption: string;
    location?: {
      latitude: number;
      longitude: number;
      address: string;
    } | null;
    datePosted?: string;
  };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<AddEntryStackParamList>();

const AddEntryStack = () => {
    const { isDarkMode } = useTheme();
    
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                },
                headerTintColor: isDarkMode ? '#ffffff' : '#000000',
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen 
                name="Camera" 
                component={AddEntryScreen} 
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="Preview" 
                component={PreviewScreen}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const { isDarkMode } = useTheme();
    const indicatorAnim = useRef(new Animated.Value(state.index * (100 / 3))).current;

    useEffect(() => {
        animateIndicator(state.index);
    }, [state.index]);

    const animateIndicator = (index: number) => {
        Animated.spring(indicatorAnim, {
            toValue: index * (430 / 3),
            useNativeDriver: true,
            tension: 50,
            friction: 8,
        }).start();
    };

    return (
        <View style={[stylesNavigation.navigationContainer, { 
            borderTopColor: isDarkMode ? 
            'rgb(36, 36, 36)' : 
            'rgb(242, 242, 242)' }]}>
            <Animated.View 
                style={[
                    stylesNavigation.indicator,
                    {backgroundColor: isDarkMode ? 
                        'rgb(223, 223, 223)' : 
                        'rgb(29, 29, 29)'},
                    {
                        transform: [{ translateX: indicatorAnim }],
                    },
                ]}
            />
            <View style={{ flexDirection: 'row' }}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <Pressable
                            key={route.key}
                            onPress={onPress}
                            style={({ pressed }) => [
                                stylesNavigation.tabBarButton,
                                pressed && !isFocused && {
                                backgroundColor: isDarkMode
                                    ? 'rgba(223, 223, 223, 0.03)'
                                    : 'rgba(29, 29, 29, 0.03)',
                                },
                            ]}
                            >
                            {({ pressed }) => (
                                <View style={stylesNavigation.tabBarContainer}>
                                <Ionicons
                                    name={
                                    route.name === "Home"
                                        ? isFocused ? "home" : "home-outline"
                                        : route.name === "Add Entry"
                                        ? isFocused ? "camera" : "camera-outline"
                                        : isFocused ? "map" : "map-outline"
                                    }
                                    style={[
                                    stylesNavigation.tabBarIcon,
                                        {
                                            color: isDarkMode ? 'rgb(171, 171, 171)' : 'rgb(29, 29, 29)',
                                            fontSize:
                                            pressed && !isFocused
                                                ? 30
                                                : 28, 
                                        },
                                        isFocused && {
                                            color: isDarkMode ? 'rgb(223, 223, 223)' : 'rgb(29, 29, 29)',
                                        },
                                    ]}
                                />
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

const NavigationControl = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Add Entry" component={AddEntryStack} />
            <Tab.Screen name="Map" component={MapScreen} />
        </Tab.Navigator>
    );
};

export default NavigationControl;
