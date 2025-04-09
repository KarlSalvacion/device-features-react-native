import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Alert, StatusBar, SafeAreaView, ScrollView, Image, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import stylesPreviewScreen from "../styles/StylesPreviewScreen";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AddEntryStackParamList } from '../navigation/NavigationControl';
import { CommonActions } from '@react-navigation/native';
import CarouselHandler from "../components/CarouselHandler";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

type Props = NativeStackScreenProps<AddEntryStackParamList, 'Preview'>;

interface TravelEntry {
  id: string;
  caption: string;
  images: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  datePosted?: string;
  isLiked: boolean;
  likeCount: number;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const PreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { images, caption, location, datePosted } = route.params;

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (!Device.isDevice) {
      return;
    }

    const { granted: existingPermission } = await Notifications.getPermissionsAsync();
    let finalPermission = existingPermission;

    if (!existingPermission) {
      const { granted: newPermission } = await Notifications.requestPermissionsAsync();
      finalPermission = newPermission;
    }

    if (!finalPermission) {
      return;
    }
  }

  const sendNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Post Shared!',
          body: 'Your travel post has been successfully shared.',
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const saveEntry = async () => {
    Alert.alert(
      "Share Post",
      "Are you sure you want to share this post?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Share",
          style: "default",
          onPress: async () => {
            setIsLoading(true);
            try {
              const newEntry: TravelEntry = {
                id: Date.now().toString(),
                caption,
                images,
                location,
                datePosted: datePosted || new Date().toISOString(),
                isLiked: false,
                likeCount: 0
              };

              const existingEntries = await AsyncStorage.getItem("travelEntries");
              const entries = existingEntries ? JSON.parse(existingEntries) : [];
              entries.push(newEntry);
              await AsyncStorage.setItem("travelEntries", JSON.stringify(entries));
              
              await sendNotification();
              
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                })
              );
            } catch (error) {
              Alert.alert("Error", "Failed to save entry");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleImageIndexChange = (_: string, index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <SafeAreaView style={[stylesPreviewScreen.container, { backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={stylesPreviewScreen.previewContainer}>
        <View style={stylesPreviewScreen.previewHeader}>
          <Pressable style={stylesPreviewScreen.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#ffffff" : "#262626"} />
          </Pressable>
          <Text style={[stylesPreviewScreen.headerTitle, { color: isDarkMode ? "#ffffff" : "#262626" }]}>Preview</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView>
          <View style={stylesPreviewScreen.imageContainer}>
            <CarouselHandler
              entryId="preview"
              onIndexChange={handleImageIndexChange}
            >
              {images.map((uri, index) => (
                <View key={index} style={stylesPreviewScreen.imageContainer}>
                  <Image 
                    source={{ uri }} 
                    style={[stylesPreviewScreen.image, { width: '100%', height: '100%' }]} 
                    resizeMode="cover"
                  />
                </View>
              ))}
            </CarouselHandler>
            
            {images.length > 1 && (
              <View style={[stylesPreviewScreen.carouselDotContainer, { position: 'absolute', bottom: 20 }]}>
                {images.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      stylesPreviewScreen.carouselDot,
                      index === currentImageIndex && stylesPreviewScreen.carouselDotActive
                    ]} 
                  />
                ))}
              </View>
            )}

            {images.length > 1 && (
              <View style={stylesPreviewScreen.carouselCounter}>
                <Text style={stylesPreviewScreen.carouselCounterText}
                >
                  {currentImageIndex + 1}/{images.length}
                </Text>
              </View>
            )}
          </View>

          <View style={stylesPreviewScreen.actionButtons}>
            <Pressable style={stylesPreviewScreen.actionButton}>
              <Ionicons name="heart-outline" size={24} color={isDarkMode ? "#ffffff" : "#262626"} />
            </Pressable>
            <Pressable style={stylesPreviewScreen.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color={isDarkMode ? "#ffffff" : "#262626"} />
            </Pressable>
          </View>

          <View style={stylesPreviewScreen.captionContainer}>
            <Text style={[stylesPreviewScreen.captionText, { color: isDarkMode ? "#ffffff" : "#262626" }]}>{caption}</Text>
            
            {location && (
              <View style={stylesPreviewScreen.locationInfo}>
                <Ionicons name="location" size={16} color={isDarkMode ? "#ffffff" : "#262626"} style={stylesPreviewScreen.locationIcon} />
                <Text style={[stylesPreviewScreen.locationText, { color: isDarkMode ? "#ffffff" : "#262626" }]}>{location.address}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={stylesPreviewScreen.footer}>
          <Pressable style={stylesPreviewScreen.saveButton} onPress={saveEntry}>
            <Text style={stylesPreviewScreen.saveButtonText}>Share</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PreviewScreen; 