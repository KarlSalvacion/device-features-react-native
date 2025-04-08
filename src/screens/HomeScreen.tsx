import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Image, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import stylesHomeScreen from "../styles/StylesHomeScreen";

interface TravelEntry {
  id: string;
  caption: string;
  images: string[];
  isLiked?: boolean;
}

const HomeScreen = ({ navigation }: any) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [entries, setEntries] = useState<TravelEntry[]>([]);

  useEffect(() => {
    loadEntries();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadEntries();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem("travelEntries");
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  };

  const removeEntry = async (id: string) => {
    try {
      const updatedEntries = entries.filter((entry) => entry.id !== id);
      await AsyncStorage.setItem("travelEntries", JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error("Error removing entry:", error);
    }
  };

  const toggleLike = async (id: string) => {
    try {
      const updatedEntries = entries.map(entry => {
        if (entry.id === id) {
          return { ...entry, isLiked: !entry.isLiked };
        }
        return entry;
      });
      
      setEntries(updatedEntries);
      await AsyncStorage.setItem("travelEntries", JSON.stringify(updatedEntries));
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const renderItem = ({ item }: { item: TravelEntry }) => (
    <View style={[stylesHomeScreen.entryContainer, { backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff" }]}>
      <View style={stylesHomeScreen.postHeader}>
        <View style={stylesHomeScreen.profilePic} />
        <Text style={[stylesHomeScreen.username, { color: isDarkMode ? "#ffffff" : "#262626" }]}>
          My Travel Post
        </Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.images.map((imageUri, index) => (
          <Image
            key={index}
            source={{ uri: imageUri }}
            style={stylesHomeScreen.image}
          />
        ))}
      </ScrollView>
      
      <View style={stylesHomeScreen.actionsContainer}>
      <Pressable 
        style={stylesHomeScreen.actionButton}
        onPress={() => toggleLike(item.id)}
        >
        <Ionicons 
            name={item.isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={item.isLiked ? "#ff0000" : (isDarkMode ? "#ffffff" : "#262626")} 
        />
        </Pressable>

        <Pressable style={stylesHomeScreen.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color={isDarkMode ? "#ffffff" : "#262626"} />
        </Pressable>
        <Pressable 
          style={stylesHomeScreen.actionButton}
          onPress={() => removeEntry(item.id)}
        >
          <Ionicons name="trash-outline" size={24} color={isDarkMode ? "#ffffff" : "#262626"} />
        </Pressable>
      </View>
      
      <Text style={[stylesHomeScreen.caption, { color: isDarkMode ? "#ffffff" : "#262626" }]}>
        <Text style={{ fontWeight: 'bold' }}>My Travel Post </Text>
        {item.caption}
      </Text>
    </View>
  );

  return (
    <View style={[stylesHomeScreen.container, { backgroundColor: isDarkMode ? "#1a1a1a" : "#f9f9f9" }]}>
      <View style={[stylesHomeScreen.header, { borderBottomColor: isDarkMode ? "#333333" : "#dbdbdb" }]}>
        <Text style={[stylesHomeScreen.title, { color: isDarkMode ? "#ffffff" : "#262626" }]}>
          Travel Diary
        </Text>
        <Pressable onPress={toggleTheme} style={stylesHomeScreen.themeButton}>
          <Ionicons
            name={isDarkMode ? "sunny" : "moon"}
            size={24}
            color={isDarkMode ? "#ffffff" : "#262626"}
          />
        </Pressable>
      </View>

      {entries.length === 0 ? (
        <View style={stylesHomeScreen.emptyContainer}>
          <Text style={[stylesHomeScreen.emptyText, { color: isDarkMode ? "#ffffff" : "#8e8e8e" }]}>
            No posts yet. Capture your first travel moment!
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={stylesHomeScreen.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default HomeScreen;
