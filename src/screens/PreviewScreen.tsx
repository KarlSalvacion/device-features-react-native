import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Alert, ScrollView, Image, Platform, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import stylesPreviewScreen from "../styles/screens/StylesPreviewScreen";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AddEntryStackParamList } from '../navigation/NavigationControl';
import { CommonActions } from '@react-navigation/native';
import CarouselHandler from "../components/CarouselHandler";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as MediaLibrary from 'expo-media-library';
import SaveToGalleryModal from '../modals/SaveToGalleryModal';

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
        shouldSetBadge: true,
    }),
});

const PreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [saveToGallery, setSaveToGallery] = useState<boolean>(false);
  const [isSaveToGalleryModalVisible, setIsSaveToGalleryModalVisible] = useState<boolean>(false);
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

  const saveImagesToGallery = async (imageUris: string[]) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to save images to your gallery.',
          [{ text: 'OK' }]
        );
        return;
      }

      for (const uri of imageUris) {
        await MediaLibrary.saveToLibraryAsync(uri);
      }

      Alert.alert('Success', 'Images saved to gallery successfully!');
    } catch (error) {
      console.error('Error saving images to gallery:', error);
      Alert.alert('Error', 'Failed to save images to gallery.');
    }
  };

  const saveEntry = async () => {
    try {
      setIsLoading(true);
      const entries = await AsyncStorage.getItem("travelEntries");
      const newEntry: TravelEntry = {
        id: Date.now().toString(),
        caption: caption || '',
        images,
        location: location || null,
        datePosted: new Date().toISOString(),
        isLiked: false,
        likeCount: 0
      };

      const existingEntries = entries ? JSON.parse(entries) : [];
      existingEntries.push(newEntry);
      await AsyncStorage.setItem("travelEntries", JSON.stringify(existingEntries));
      
      await sendNotification();
      
      if (saveToGallery) {
        await saveImagesToGallery(images);
      }
      
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    Alert.alert(
      'Confirm Post',
      'Are you sure you want to share this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Share',
          onPress: saveEntry
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
      <View style={[
        stylesPreviewScreen.previewContainer, 
        { backgroundColor: isDarkMode ? 
          "rgb(29, 29, 29)" : 
          "rgb(253, 253, 253)" }
        ]}>
        <View style={stylesPreviewScreen.previewHeader}>
          <Pressable style={stylesPreviewScreen.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#ffffff" : "#262626"} />
          </Pressable>
          
          <Text style={[
            stylesPreviewScreen.headerTitle, { 
            color: isDarkMode ? 
            "rgb(223, 223, 223)" : 
            "rgb(29, 29, 29)" }
            ]}>
            Preview

          </Text>
          <Pressable 
            style={stylesPreviewScreen.saveToGalleryButton}
            onPress={() => setIsSaveToGalleryModalVisible(true)}
          >
            <Ionicons 
              name={saveToGallery ? "ellipsis-horizontal" : "ellipsis-horizontal"} 
              size={24} 
              color={isDarkMode ? "#ffffff" : "#262626"} 
            />
          </Pressable>
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
              <Ionicons name="heart-outline" size={24} color={isDarkMode ? 
                "rgb(223, 223, 223)" : 
                "rgb(29, 29, 29)" } />
            </Pressable>
            <Pressable style={stylesPreviewScreen.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color={isDarkMode ? 
                "rgb(223, 223, 223)" : 
                "rgb(29, 29, 29)" } />
            </Pressable>
          </View>

          <View style={stylesPreviewScreen.captionContainer}>
            <Text style={[stylesPreviewScreen.captionText, 
              { color: isDarkMode ? 
              "rgb(223, 223, 223)" : 
              "rgb(29, 29, 29)" }
              ]}>
              <Text style={{ fontWeight: 'bold'}}>Karl Salvacion</Text> {caption}
            </Text>
            
            {location && (
              <View style={stylesPreviewScreen.locationInfo}>
                <Ionicons name="location" size={16} color={isDarkMode ? 
                  "rgb(223, 223, 223)" : 
                  "rgb(29, 29, 29)" } style={stylesPreviewScreen.locationIcon} />
                <Text style={[stylesPreviewScreen.locationText, { color: isDarkMode ? 
                  "rgb(223, 223, 223)" : 
                  "rgb(29, 29, 29)" }]}>{location.address}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <SaveToGalleryModal
          isVisible={isSaveToGalleryModalVisible}
          onClose={() => setIsSaveToGalleryModalVisible(false)}
          isDarkMode={isDarkMode}
          saveToGallery={saveToGallery}
          onToggleSave={() => setSaveToGallery(!saveToGallery)}
        />

        <View style={stylesPreviewScreen.footer}>
          <Pressable 
            style={({ pressed }) => [
              stylesPreviewScreen.saveButton,
              { backgroundColor: isDarkMode ? 
                "rgb(253, 253, 253)" : 
                "rgb(31, 25, 4)" },
              pressed && { opacity: 0.7 }
            ]} 
            onPress={handleShare}
          >
            <Ionicons name="send" size={24} color={isDarkMode ? 
              "rgb(29, 29, 29)" : 
              "rgb(223, 223, 223)" } 
            />
            <Text style={[stylesPreviewScreen.saveButtonText, { color: isDarkMode ? 
              "rgb(29, 29, 29)" : 
              "rgb(223, 223, 223)" }]}>
              Share
            </Text>
          </Pressable>
        </View>
      </View>
  );
};

export default PreviewScreen; 