import React, { useState } from "react";
import { View, Text, Pressable, Alert, StatusBar, SafeAreaView, Image, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import stylesPreviewScreen from "../styles/StylesPreviewScreen";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AddEntryStackParamList } from '../navigation/NavigationControl';
import { CommonActions } from '@react-navigation/native';

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
}

const PreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { isDarkMode } = useTheme();
  const { sendNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { images, caption, location } = route.params;

  const saveEntry = async () => {
    setIsLoading(true);
    try {
      const newEntry: TravelEntry = {
        id: Date.now().toString(),
        caption,
        images,
        location
      };

      const existingEntries = await AsyncStorage.getItem("travelEntries");
      const entries = existingEntries ? JSON.parse(existingEntries) : [];
      entries.push(newEntry);
      await AsyncStorage.setItem("travelEntries", JSON.stringify(entries));

      await sendNotification("Travel Entry Saved", "Your travel entry has been successfully saved!");
      
      // Navigate to the Home tab and reset navigation state
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
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[stylesPreviewScreen.container, { backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={stylesPreviewScreen.previewContainer}>
        <View style={stylesPreviewScreen.previewHeader}>
          <Pressable style={stylesPreviewScreen.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={stylesPreviewScreen.headerTitle}>Preview</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView>
          <View style={stylesPreviewScreen.imageContainer}>
            <Image source={{ uri: images[0] }} style={stylesPreviewScreen.image} />
          </View>

          <View style={stylesPreviewScreen.actionButtons}>
            <Pressable style={stylesPreviewScreen.actionButton}>
              <Ionicons name="heart-outline" size={24} color="#fff" />
            </Pressable>
            <Pressable style={stylesPreviewScreen.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            </Pressable>
            <Pressable style={stylesPreviewScreen.actionButton}>
              <Ionicons name="paper-plane-outline" size={24} color="#fff" />
            </Pressable>
          </View>

          <View style={stylesPreviewScreen.captionContainer}>
            <Text style={stylesPreviewScreen.captionText}>{caption}</Text>
            
            {location && (
              <View style={stylesPreviewScreen.locationInfo}>
                <Ionicons name="location" size={16} color="#fff" style={stylesPreviewScreen.locationIcon} />
                <Text style={stylesPreviewScreen.locationText}>{location.address}</Text>
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