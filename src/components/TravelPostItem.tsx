import React, { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import stylesTravelPostItem from "../styles/components/StylesTravelPostItem";
import { TravelEntry, formatPostDate } from "../types/TravelEntry";
import CarouselHandler from "./CarouselHandler";
import PostOptionsModal from "../modals/PostOptionsModal";

interface TravelPostItemProps {
  item: TravelEntry;
  isDarkMode: boolean;
  onToggleLike: (id: string) => void;
  onRemove: (id: string) => void;
  onImagePress: (id: string, event: any) => void;
  currentImageIndex: number;
  onImageIndexChange: (id: string, index: number) => void;
}

const TravelPostItem: React.FC<TravelPostItemProps> = ({
  item,
  isDarkMode,
  onToggleLike,
  onRemove,
  onImagePress,
  currentImageIndex = 0,
  onImageIndexChange
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const renderCarousel = () => {
    if (item.images.length > 1) {
      return (
        <CarouselHandler
          entryId={item.id}
          onIndexChange={onImageIndexChange}
        >
          {item.images.map((imageUri, index) => (
            <Pressable
              key={index}
              onPress={(e) => onImagePress(item.id, e)}
              style={stylesTravelPostItem.imageContainer}
            >
              <Image
                source={{ uri: imageUri }}
                style={stylesTravelPostItem.image}
              />
            </Pressable>
          ))}
        </CarouselHandler>
      );
    }
    
    return (
      <Pressable 
        onPress={(e) => onImagePress(item.id, e)}
        style={[
            stylesTravelPostItem.imageContainer
        ]}
      >
        <Image
          source={{ uri: item.images[0] }}
          style={stylesTravelPostItem.image}
        />
      </Pressable>
    );
  };

  return (
    <View style={[stylesTravelPostItem.entryContainer, { 
        backgroundColor: isDarkMode ? 
            "rgb(29, 29, 29)" : 
            "rgb(253, 253, 253)" 
        }]}>
      <View style={stylesTravelPostItem.postHeader}>
        <View style={stylesTravelPostItem.profilePic}>
            <Image source={require("../assets/Karlflower.jpg")} style={stylesTravelPostItem.profilePicImage}/>
        </View>
        <View style={stylesTravelPostItem.headerTextContainer}>
          <Text style={[stylesTravelPostItem.username, { color: isDarkMode ? "#ffffff" : "#262626" }]}>
            Karl Salvacion
          </Text>
        </View>
        <Pressable 
          onPress={() => setIsModalVisible(true)}
          style={stylesTravelPostItem.moreButton}
        >
          <Ionicons 
            name="ellipsis-horizontal" 
            size={24} 
            color={isDarkMode ? "#ffffff" : "#262626"} 
          />
        </Pressable>
      </View>
      
      <View style={stylesTravelPostItem.imageContainer}>
        {renderCarousel()}
        {item.images.length > 1 && (
          <View style={stylesTravelPostItem.carouselDotContainer}>
            {item.images.map((_, index) => (
              <View 
                key={index} 
                style={[
                  stylesTravelPostItem.carouselDot,
                  index === currentImageIndex && stylesTravelPostItem.carouselDotActive
                ]} 
              />
            ))}
          </View>
        )}

        {item.images.length > 1 && (
          <View style={stylesTravelPostItem.carouselCounter}>
            <Text style={stylesTravelPostItem.carouselCounterText}>
              {currentImageIndex + 1}/{item.images.length}
            </Text>
          </View>
        )}
      </View>
      
      <View style={stylesTravelPostItem.actionsContainer}>
        <View style={stylesTravelPostItem.likeContainer}>
          <Pressable 
            style={stylesTravelPostItem.actionButton}
            onPress={() => onToggleLike(item.id)}
          >
            <Ionicons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={26} 
              color={item.isLiked ? "#ff0000" : (isDarkMode ? "#ffffff" : "#262626")} 
            />
          </Pressable>
          <Text style={[stylesTravelPostItem.likeCount, { color: isDarkMode ? "#ffffff" : "#262626" }]}>
            {item.likeCount}
          </Text>
        </View>

        <Pressable style={stylesTravelPostItem.actionButton}>
          <Ionicons name="chatbubble-outline" 
          size={26} 
          color={isDarkMode ? "#ffffff" : "#262626"} />
        </Pressable>
      </View>
      
      {item.caption && (
        <Text style={[stylesTravelPostItem.caption, { color: isDarkMode ? "#ffffff" : "#262626" }]}>
          <Text style={{ fontWeight: 'bold' }}>Karl Salvacion</Text> {item.caption}
        </Text>
      )}

      {item.location && (
        <View style={stylesTravelPostItem.locationContainer}>
          <Ionicons 
            name="location" 
            size={16} 
            color={isDarkMode ? "#cccccc" : "#8e8e8e"} 
            style={stylesTravelPostItem.locationIcon} 
          />
          <Text style={[stylesTravelPostItem.locationText, 
            { color: isDarkMode ? "#cccccc" : "rgb(62, 62, 62)" }]}>
            {typeof item.location === 'string' 
              ? item.location 
              : item.location.address}
          </Text>
        </View>
      )}

      <Text style={[stylesTravelPostItem.dateText, { color: isDarkMode ? "#ffffff" : "#8e8e8e" }]}>
        {formatPostDate(item.datePosted || new Date().toISOString())}
      </Text>

      <PostOptionsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onDelete={() => onRemove(item.id)}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

export default TravelPostItem; 