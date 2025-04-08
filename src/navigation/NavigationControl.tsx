import React from "react";
import { View, Text, Pressable } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../context/ThemeContext";
import HomeScreen from '../screens/HomeScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import MapScreen from '../screens/MapScreen';
import PreviewScreen from '../screens/PreviewScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { RootTabParamList } from './NavigationType';
import stylesNavigation from "../styles/StylesNavigation";
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';

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
                headerTitleAlign: 'center'
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

const NavigationControl = () => {
    const { isDarkMode } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: stylesNavigation.navigationContainer,
                tabBarButton: ({ accessibilityState, onPress }) => {
                    const focused = accessibilityState?.selected;

                    return (
                        <Pressable
                            onPress={onPress}
                            style={({ pressed }) => [
                                stylesNavigation.tabBarButton,
                                pressed && stylesNavigation.tabBarButtonPressed,
                            ]}
                        >
                            {({ pressed }) => (
                                <>
                                    {pressed && (
                                        <LinearGradient
                                            colors={['#4c669f', '#3b5998', '#192f6a']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={stylesNavigation.tabBarContainer}
                                        >
                                        </LinearGradient>
                                    )}

                                    <View style={stylesNavigation.tabBarContainer}>
                                        {route.name === "Home" ? (
                                            <Ionicons
                                                name={focused ? "home" : "home-outline"}
                                                style={[
                                                    stylesNavigation.tabBarIcon,
                                                    isDarkMode && stylesNavigation.activeTabBarIcon,
                                                    focused && stylesNavigation.activeTabBarIcon
                                                ]}
                                            />
                                        ) : route.name === "Add Entry" ? (
                                            <Ionicons
                                                name={focused ? "camera" : "camera-outline"}
                                                style={[
                                                    stylesNavigation.tabBarIcon,
                                                    focused && stylesNavigation.activeTabBarIcon
                                                ]}
                                            />
                                        ) : (
                                            <Ionicons
                                                name={focused ? "map" : "map-outline"}
                                                style={[
                                                    stylesNavigation.tabBarIcon,
                                                    focused && stylesNavigation.activeTabBarIcon
                                                ]}
                                            />
                                        )}

                                        <Text style={stylesNavigation.tabBarText}>
                                            {route.name}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </Pressable>
                    );
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen  name="Add Entry" component={AddEntryStack}/>
            <Tab.Screen name="Map" component={MapScreen} />
        </Tab.Navigator>
    );
};

export default NavigationControl;
