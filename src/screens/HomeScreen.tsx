import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, Pressable, RefreshControl } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import stylesHomeScreen from "../styles/screens/StylesHomeScreen";
import TravelPostItem from "../components/TravelPostItem";
import AnimatedHeart from "../components/AnimatedHeart";
import { TravelEntry } from "../types/TravelEntry";
import { loadTravelEntries, removeEntry, toggleLikeEntry } from "../utility/StorageUtility";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Font from 'expo-font';

const HomeScreen = ({ navigation }: any) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [showHeart, setShowHeart] = useState<{id: string, heartId: string, x: number, y: number}[]>([]);
  const lastTapTimeRef = useRef<Record<string, number>>({});
  const heartIdCounter = useRef(0);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Gothic-Expanded': require('../assets/fonts/SpecialGothicExpandedOne-Regular.ttf'),
        'Instrument-Regular': require('../assets/fonts/InstrumentSerif-Regular.ttf'),
        'Playfair-Black-Italic': require('../assets/fonts/PlayfairDisplay-BlackItalic.ttf'),
        'Playfair-Black': require('../assets/fonts/PlayfairDisplay-Black.ttf'),
        'LobsterTwo-Bold-Italic': require('../assets/fonts/LobsterTwo-BoldItalic.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFont();
  }, []);

  useEffect(() => {
    if (Device.isDevice) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    }
  }, []);

  useEffect(() => {
    loadEntries();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadEntries();
      setCurrentTime(new Date());
    });
   
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); 
    
    return () => {
      unsubscribe();
      clearInterval(timeInterval);
    };
  }, [navigation]);

  const loadEntries = async () => {
    const loadedEntries = await loadTravelEntries();
    setEntries(loadedEntries);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentTime(new Date());
    await loadEntries();
    await delay(500);
    setRefreshing(false);
  };


  const handleRemoveEntry = async (id: string) => {
    const updatedEntries = await removeEntry(entries, id);
    setEntries(updatedEntries);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Post Deleted",
        body: "Your travel post has been successfully deleted",
      },
      trigger: null, 
    });
  };

  const handleToggleLike = async (id: string) => {
    const updatedEntries = await toggleLikeEntry(entries, id);
    setEntries(updatedEntries);
  };

  const handleImagePress = (entryId: string, event: any) => {
    const now = Date.now();
    const lastTap = lastTapTimeRef.current[entryId] || 0;
    
    if (now - lastTap < 300) { 

      const { locationX, locationY } = event.nativeEvent;
      const newHeartId = `heart-${heartIdCounter.current++}`;
      setShowHeart(prev => [...prev, { id: entryId, heartId: newHeartId, x: locationX, y: locationY }]);
      
      if (!entries.find(entry => entry.id === entryId)?.isLiked) {
        handleToggleLike(entryId);
      }
    }
    
    lastTapTimeRef.current = {
      ...lastTapTimeRef.current,
      [entryId]: now
    };
  };

  const handleImageIndexChange = (entryId: string, index: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [entryId]: index
    }));
  };

  const handleHeartAnimationComplete = (heartId: string) => {
    setShowHeart(prev => prev.filter(heart => heart.heartId !== heartId));
  };

  const renderItem = ({ item }: { item: TravelEntry }) => {
    const currentIndex = currentImageIndices[item.id] || 0;
    
    return (
      <View style={{ position: 'relative' }}>
        <TravelPostItem
          item={item}
          isDarkMode={isDarkMode}
          onToggleLike={handleToggleLike}
          onRemove={handleRemoveEntry}
          onImagePress={handleImagePress}
          currentImageIndex={currentIndex}
          onImageIndexChange={handleImageIndexChange}
        />
        {showHeart
          .filter(heart => heart.id === item.id)
          .map(heart => (
            <AnimatedHeart
              key={heart.heartId}
              isVisible={true}
              onAnimationComplete={() => handleHeartAnimationComplete(heart.heartId)}
              tapX={heart.x}
              tapY={heart.y}
            />
          ))}
      </View>
    );
  };

  return (
    <View style={[
      stylesHomeScreen.container, { 
      backgroundColor: isDarkMode ? 
        "rgb(29, 29, 29)" : 
        "rgb(253, 253, 253)" }
      ]}>
      <Pressable 
        style={[stylesHomeScreen.header, { 
        backgroundColor: isDarkMode ? 
          "rgb(29, 29, 29)" : 
          "rgb(253, 253, 253)" }
        ]}
        onPress={scrollToTop}
      >
        <Text style={[stylesHomeScreen.title, { 
          color: isDarkMode ? 
            "rgb(253, 253, 253)" : 
            "rgb(29, 29, 29)" }
          ]}>
          WeTravelogue
        </Text>
        <Pressable onPress={toggleTheme} style={({ pressed }) => [
          stylesHomeScreen.themeButton,
          pressed && { opacity: 0.7 }
        ]}>
          <Ionicons
            name={isDarkMode ? "sunny" : "moon"}
            size={24}
            color={isDarkMode ? "#ffffff" : "#262626"}
          />
        </Pressable>
      </Pressable>

      {entries.length === 0 ? (
        <View style={stylesHomeScreen.emptyContainer}>
          <AntDesign name="frowno" style={stylesHomeScreen.emptyIcon}/>
          <Text style={[stylesHomeScreen.emptyText, { color: isDarkMode ? "#8e8e8e" : "#8e8e8e" }]}>
            No posts yet. Capture your first travel moment!
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={entries}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={stylesHomeScreen.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["rgb(253, 253, 253)"]}
              tintColor={isDarkMode ? "rgb(253, 253, 253)" : "rgb(31, 25, 4)"}
            />
          }
        />
      )}
    </View>
  );
};

export default HomeScreen;
