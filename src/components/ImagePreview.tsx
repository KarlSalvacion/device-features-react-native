import React from 'react';
import { View, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import stylesImagePreview from '../styles/StylesImagePreview';

interface ImagePreviewProps {
  images: string[];
  onRemoveImage: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onRemoveImage }) => {
  const { isDarkMode } = useTheme();

  return (
    <ScrollView 
        horizontal 
        style={stylesImagePreview.imageScrollView}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 }}
    >
        {images.map((uri, index) => (
        <View key={index} style={stylesImagePreview.imageContainer}>
          <Pressable
            style={({ pressed }) => [
                stylesImagePreview.removeButton,
                pressed && { opacity: 0.7 }
            ]}
            onPress={() => onRemoveImage(index)}
          >
            <Ionicons name="close-circle" style={stylesImagePreview.removeButtonIcon} />
          </Pressable>
          <Image source={{ uri }} style={stylesImagePreview.image} />
        </View>
      ))}
    </ScrollView>
  );
};

export default ImagePreview;