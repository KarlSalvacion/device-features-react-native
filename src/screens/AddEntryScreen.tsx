import React, { useState, useEffect } from "react";
import { View, Pressable, Text, Alert, StatusBar, SafeAreaView, Linking, TextInput, ScrollView, Keyboard, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import ImagePreview from "../components/ImagePreview";
import stylesAddEntryScreen from "../styles/StylesAddEntryScreen";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const MAX_IMAGES = 5;

const AddEntryScreen = ({ navigation }: any) => {
    const { isDarkMode } = useTheme();
    const [images, setImages] = useState<string[]>([]);
    const [showCamera, setShowCamera] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [caption, setCaption] = useState<string>("");
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [address, setAddress] = useState<string>("");
    const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

    
    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoading(false);
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);

    const handleTakePicture = (uri: string) => {
        if (images.length >= MAX_IMAGES) {
        Alert.alert("Limit Reached", `You can only add up to ${MAX_IMAGES} images`);
        return;
        }
        setImages([...images, uri]);
        setShowCamera(false);
    };

    const handleOpenCamera = async () => {
        try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
            'Camera Permission Required',
            'This app needs access to your camera to take photos for your travel diary.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
            aspect: [1, 1],
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const uri = result.assets[0].uri;
            handleTakePicture(uri);
        }
        } catch (error) {
        console.error('Failed to take picture:', error);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        if (newImages.length === 0) {
        setShowCamera(true);
        }
    };

    const formatAddress = (name: string, city: string, region: string, postalCode: string) => {
        const parts = [name, city, region, postalCode].filter(part => part !== '');
        return parts.join(', ');
    };

    const getAddress = async () => {
        if (!location) return;
        
        try {
            const addressResponse = await Location.reverseGeocodeAsync({
                latitude: location.latitude,
                longitude: location.longitude,
            });
            
            if (addressResponse && addressResponse.length > 0) {
                setAddress(
                    formatAddress(
                        addressResponse[0].name ?? '',
                        addressResponse[0].city ?? '',
                        addressResponse[0].region ?? '',
                        addressResponse[0].postalCode ?? ''
                    )
                );
            }
        } catch (error) {
            console.error('Error getting address:', error);
        }
    };

    const getLocation = async () => {
        setIsLoadingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Location Permission Required',
                    'This app needs access to your location to tag your photos.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
                setIsLoadingLocation(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest
            });
            
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude
            });
            
            // Get address after setting location
            const addressResponse = await Location.reverseGeocodeAsync({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude
            });
            
            if (addressResponse && addressResponse.length > 0) {
                setAddress(
                    formatAddress(
                        addressResponse[0].name ?? '',
                        addressResponse[0].city ?? '',
                        addressResponse[0].region ?? '',
                        addressResponse[0].postalCode ?? ''
                    )
                );
            }
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Error', 'Failed to retrieve location. Please try again.');
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const handlePreview = () => {
        if (images.length === 0) {
        Alert.alert("Error", "Please take at least one photo");
        return;
        }
        navigation.navigate("Preview", { 
            images, 
            caption,
            location: location ? {
                ...location,
                address: address
            } : null
        });
    };

    const goToHome = () => {
        navigation.getParent()?.navigate('Home');
    };

    return (
        <View style={[stylesAddEntryScreen.mainContainer, { backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }]}>

            <View style={stylesAddEntryScreen.headerContainer}>
                <Text style={stylesAddEntryScreen.headerTitle}>Add Entry</Text>
            </View>

            <ScrollView 
                style={stylesAddEntryScreen.contentContainer}
                onScrollBeginDrag={Keyboard.dismiss}
                scrollEnabled={false}
            >   
                
                <View style={stylesAddEntryScreen.imagePreviewContainer}>
                    <View style={stylesAddEntryScreen.imagePreviewHeader}>
                        <Pressable 
                            style={({ pressed }) => [
                            stylesAddEntryScreen.captureButton,
                            pressed && { opacity: 0.7 }
                            ]}
                            onPress={handleOpenCamera}
                        >
                            <Ionicons 
                            name="camera" 
                            size={26} 
                            color={isDarkMode ? "#ffffff" : "#262626"} 
                            />

                            <Text style={stylesAddEntryScreen.cameraButtonText}>
                                Take Photo
                            </Text>
                        </Pressable>
                        
                        <Text style={[stylesAddEntryScreen.imageCount, { color: isDarkMode ? "#ffffff" : "#262626" }]}>
                            {images.length}/{MAX_IMAGES} photos
                        </Text>
                    </View>
                    
                    <ImagePreview images={images} onRemoveImage={removeImage} />
                </View>

                <View style={stylesAddEntryScreen.captionContainer}>
                    <Text style={stylesAddEntryScreen.captionTitle}>Caption</Text>

                    <TextInput
                        style={[
                            stylesAddEntryScreen.captionInput,
                            { 
                                color: isDarkMode ? "#ffffff" : "#000000",
                            }
                        ]}
                        placeholder="Write a caption..."
                        placeholderTextColor={isDarkMode ? "#888888" : "#8e8e8e"}
                        value={caption}
                        keyboardAppearance={isDarkMode ? "dark" : "light"}
                        onChangeText={setCaption}
                    />
                </View>

                <View style={stylesAddEntryScreen.locationContainer}>
                    <View style={stylesAddEntryScreen.locationHeader}>
                        <Text style={stylesAddEntryScreen.locationTitle}>Location</Text>
                        <Pressable 
                            style={({ pressed }) => [
                                stylesAddEntryScreen.locationButton,
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={getLocation}
                            disabled={isLoadingLocation}
                        >
                            <Ionicons 
                                name="location" 
                                size={20} 
                                color={isDarkMode ? "#ffffff" : "#262626"} 
                            />
                            <Text style={stylesAddEntryScreen.locationButtonText}>
                                {isLoadingLocation ? "Getting location..." : "Get Current Location"}
                            </Text>
                            {isLoadingLocation && (
                                <ActivityIndicator size="small" color="#0095f6" style={{ marginLeft: 5 }} />
                            )}
                        </Pressable>
                    </View>
                    
                    {location && (
                        <View style={stylesAddEntryScreen.locationDetails}>
                            <Text style={stylesAddEntryScreen.locationAddress}>
                                {address || "Location found"}
                            </Text>
                            <Text style={stylesAddEntryScreen.locationCoordinates}>
                                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={[
                stylesAddEntryScreen.footer,
                { backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }
            ]}>
                <Pressable
                    style={({ pressed }) => [
                    stylesAddEntryScreen.nextButton,
                    { opacity: pressed ? 0.7 : images.length === 0 ? 0.5 : 1 }
                    ]}
                    onPress={handlePreview}
                    disabled={images.length === 0}
                >
                    <Text style={stylesAddEntryScreen.nextButtonText}>Preview</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default AddEntryScreen;
