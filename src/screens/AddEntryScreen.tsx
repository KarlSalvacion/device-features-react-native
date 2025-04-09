import React, { useState, useEffect } from "react";
import { View, Pressable, Text, Alert, Linking, TextInput, ScrollView, Keyboard, ActivityIndicator } from "react-native";
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
            } : null,
            datePosted: new Date().toISOString()
        });
    };

    const goToHome = () => {
        navigation.getParent()?.navigate('Home');
    };

    const removeLocation = () => {
        setLocation(null);
        setAddress("");
    };

    const clearAllInputs = () => {
        Alert.alert(
            "Clear All",
            "Are you sure you want to clear all inputs?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: () => {
                        setImages([]);
                        setCaption("");
                        setLocation(null);
                        setAddress("");
                        setShowCamera(true);
                    }
                }
            ]
        );
    };

    const clearCaption = () => {
        setCaption("");
    };

    return (
        <View style={[
            stylesAddEntryScreen.mainContainer, { 
            backgroundColor: isDarkMode ? 
                "rgb(29, 29, 29)" : 
                "rgb(253, 253, 253)" 
            }]}>
            <View style={[stylesAddEntryScreen.headerContainer, { 
                backgroundColor: isDarkMode ? 
                    "rgb(29, 29, 29)" : 
                    "rgb(253, 253, 253)" 
            }]}>
                <Text style={[
                    stylesAddEntryScreen.headerTitle, { 
                    color: isDarkMode ? 
                        "rgb(223, 223, 223)" : 
                        "rgb(29, 29, 29)" 
                    }]}>Add Entry</Text>
                <Pressable 
                    style={({ pressed }) => [
                        stylesAddEntryScreen.clearButton,
                        pressed && { opacity: 0.7 }
                    ]}
                    onPress={clearAllInputs}
                >
                    <Ionicons 
                        name="trash-outline" 
                        size={24} 
                        color={isDarkMode ? 
                            "rgb(223, 223, 223)" : 
                                "rgb(29, 29, 29)" } 
                    />
                    <Text style={[stylesAddEntryScreen.clearButtonText, { color: isDarkMode ? 
                        "rgb(223, 223, 223)" : 
                        "rgb(29, 29, 29)" }]}>
                        Clear
                    </Text>
                </Pressable>
            </View>

            <ScrollView 
                style={[stylesAddEntryScreen.contentContainer, {
                    backgroundColor: isDarkMode ? 
                        "rgb(29, 29, 29)" : 
                        "rgb(253, 253, 253)" 
                }]}
                onScrollBeginDrag={Keyboard.dismiss}
                scrollEnabled={false}
            >   
                <View style={[stylesAddEntryScreen.imagePreviewContainer, {
                    backgroundColor: isDarkMode ? 
                        "rgb(29, 29, 29)" : 
                        "rgb(253, 253, 253)" 
                }]}>
                    <ImagePreview images={images} onRemoveImage={removeImage} />
                </View>

                <View style={[stylesAddEntryScreen.captionContainer, {
                    backgroundColor: isDarkMode ? 
                        "rgb(29, 29, 29)" : 
                        "rgb(253, 253, 253)" 
                }]}>
                    <View style={stylesAddEntryScreen.captionHeader}>
                        <Text style={[stylesAddEntryScreen.captionTitle, { 
                            color: isDarkMode ? 
                                "rgb(223, 223, 223)" : 
                                "rgb(29, 29, 29)" 
                        }]}>Caption</Text>
                        <Text style={[stylesAddEntryScreen.imageCount, { 
                            color: isDarkMode ? 
                                "rgb(223, 223, 223)" : 
                                "rgb(29, 29, 29)",
                            opacity: images.length >= MAX_IMAGES ? 0.5 : 1
                        }]}>
                            {images.length}/{MAX_IMAGES} photos
                        </Text>
                    </View>

                    <View style={stylesAddEntryScreen.captionInputContainer}>
                        <TextInput
                            style={[
                                stylesAddEntryScreen.captionInput,
                                { 
                                    color: isDarkMode ? "#ffffff" : "#000000",
                                    borderColor: isDarkMode ? 
                                    "rgb(253, 253, 253)" : 
                                    "rgb(29, 29, 29)",
                                }
                            ]}
                            placeholder="Write a caption..."
                            placeholderTextColor={isDarkMode ? "#888888" : "#8e8e8e"}
                            value={caption}
                            keyboardAppearance={isDarkMode ? "dark" : "light"}
                            onChangeText={setCaption}
                            returnKeyType="done"
                        />
                        {caption.length > 0 && (
                            <Pressable 
                                style={stylesAddEntryScreen.clearCaptionButton}
                                onPress={clearCaption}
                            >
                                <Ionicons 
                                    name="close-circle" 
                                    size={20} 
                                    color={isDarkMode ? "#ffffff" : "#262626"} 
                                />
                            </Pressable>
                        )}
                    </View>
                </View>

                <View style={[stylesAddEntryScreen.locationContainer, {
                    backgroundColor: isDarkMode ? 
                        "rgb(29, 29, 29)" : 
                        "rgb(253, 253, 253)" 
                }]}>
                    <View style={stylesAddEntryScreen.locationHeader}>
                        <Text style={[stylesAddEntryScreen.locationTitle, { 
                            color: isDarkMode ? 
                                "rgb(223, 223, 223)" : 
                                "rgb(29, 29, 29)" 
                        }]}>Location</Text>
                        <Pressable 
                            style={({ pressed }) => [
                                stylesAddEntryScreen.locationButton,
                                {
                                    backgroundColor: isDarkMode ? 
                                        "rgb(29, 29, 29)" : 
                                        "rgb(253, 253, 253)",
                                    borderColor: isDarkMode ? 
                                        "rgb(253, 253, 253)" : 
                                        "rgb(29, 29, 29)"
                                },
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={location ? removeLocation : getLocation}
                            disabled={isLoadingLocation}
                        >
                            <Ionicons 
                                name={location ? "close" : "location"} 
                                size={20} 
                                color={isDarkMode ? 
                                    "rgb(223, 223, 223)" : 
                                    "rgb(29, 29, 29)" } 
                            />
                            <Text style={[stylesAddEntryScreen.locationButtonText, { 
                                color: isDarkMode ? 
                                    "rgb(223, 223, 223)" : 
                                    "rgb(29, 29, 29)" 
                            }]}>
                                {isLoadingLocation ? "Getting location..." : location ? "Remove Location" : "Get Current Location"}
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
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={[
                stylesAddEntryScreen.footer,
                { backgroundColor: isDarkMode ? 
                    "rgb(29, 29, 29)" : 
                    "rgb(253, 253, 253)" 
                }
            ]}>
                <Pressable
                    style={({ pressed }) => [
                        stylesAddEntryScreen.nextButton,
                        { backgroundColor: isDarkMode ? 
                            "rgb(253, 253, 253)" : 
                            "rgb(53, 43, 4)" 
                        },
                        { opacity: pressed ? 0.7 : images.length === 0 ? 0.5 : 1 }
                    ]}
                    onPress={handlePreview}
                    disabled={images.length === 0}
                >
                    <Text style={stylesAddEntryScreen.nextButtonText}>Preview</Text>
                </Pressable>

                <Pressable 
                    style={({ pressed }) => [
                        stylesAddEntryScreen.captureButton,
                        { backgroundColor: isDarkMode ? 
                            "rgb(253, 253, 253)" : 
                            "rgb(253, 253, 253)" 
                        },
                        pressed && { opacity: 0.7 },
                        images.length >= MAX_IMAGES && { opacity: 0.5 }
                    ]}
                    onPress={handleOpenCamera}
                    disabled={images.length >= MAX_IMAGES}
                >
                    <Ionicons 
                        name="camera" 
                        size={26} 
                        color={isDarkMode ? 
                            "rgb(29, 29, 29)" : 
                            "rgb(53, 43, 4)rgb(53, 43, 4)"}
                    />
                    <Text style={[stylesAddEntryScreen.cameraButtonText, { 
                        color: isDarkMode ? 
                            "rgb(29, 29, 29)" : 
                            "rgb(53, 43, 4)",
                        opacity: images.length >= MAX_IMAGES ? 0.5 : 1
                    }]}>
                        Take Photo
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default AddEntryScreen;
