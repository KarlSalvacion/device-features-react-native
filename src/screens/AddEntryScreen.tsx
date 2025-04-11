import React, { useState, useEffect } from "react";
import { View, Pressable, Text, Alert, Linking, TextInput, ScrollView, Keyboard, ActivityIndicator, TouchableWithoutFeedback, InputAccessoryView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import ImagePreview from "../components/ImagePreview";
import stylesAddEntryScreen from "../styles/screens/StylesAddEntryScreen";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

const MAX_IMAGES = 5;
const MAX_CAPTION_LENGTH = 150;

const BAD_WORDS = [
    'retard', 'nigger','nigga', 'fag', 'faggot', 'whore', 'slut', 
    'chink', 'ching chong', 'dyke', 'tranny','retards', 'niggers',
    'niggas', 'fags', 'faggots', 'whores', 'sluts', 'chinks', 
    'ching chongs', 'dykes', 'trannies',
];

const validationSchema = Yup.object().shape({
  caption: Yup.string()
    .max(MAX_CAPTION_LENGTH, `Caption must be at most ${MAX_CAPTION_LENGTH} characters`)
    .test('no-trailing-linebreak', 'Caption cannot end with a line break', (value) => {
      if (!value) return true;
      return !value.endsWith('\n');
    })
    .test('no-bad-words', 'Please refrain from using hateful and discriminatory language', (value) => {
      if (!value) return true;
      const words = value.toLowerCase().split(/\s+/);
      return !words.some(word => BAD_WORDS.includes(word));
    }),
});

interface FormValues {
  caption: string;
}

const AddEntryScreen = ({ navigation }: any) => {
    const { isDarkMode } = useTheme();
    const [images, setImages] = useState<string[]>([]);
    const [showCamera, setShowCamera] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [address, setAddress] = useState<string>("");
    const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
    const [isCaptionFocused, setIsCaptionFocused] = useState<boolean>(false);

    
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

    const handlePreview = (values: { caption: string }) => {
        if (images.length === 0) {
        Alert.alert("Error", "Please take at least one photo");
        return;
        }
        navigation.navigate("Preview", { 
            images, 
            caption: values.caption,
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

    const clearAllInputs = (resetForm: () => void) => {
        Alert.alert(
            "Clear All",
            "Are you sure you want to clear all inputs?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear All",
                    style: "destructive",
                    onPress: () => {
                        setImages([]);
                        setLocation(null);
                        setAddress("");
                        setShowCamera(true);
                        resetForm();
                    }
                }
            ]
        );
    };

    const getActualCharacterCount = (text: string) => {
        return text.replace(/[\s\n]/g, '').length;
    };

    return (
        <Formik<FormValues>
            initialValues={{ caption: '' }}
            validationSchema={validationSchema}
            onSubmit={handlePreview}
        >
            {(formikProps: FormikProps<FormValues>) => (
                <View style={[
                    stylesAddEntryScreen.mainContainer, { 
                    backgroundColor: isDarkMode ? 
                        "rgb(29, 29, 29)" : 
                        "rgb(253, 253, 253)" 
                    }]}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <>
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
                                    onPress={() => clearAllInputs(formikProps.resetForm)}
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
                                                    borderColor: isCaptionFocused ? 
                                                        "rgb(253, 253, 253)" : 
                                                        (isDarkMode ? 
                                                            "rgb(185, 185, 185)" : 
                                                            "rgb(168, 168, 168)"),
                                                },
                                        
                                                !isDarkMode && isCaptionFocused && {
                                                    borderColor: "rgb(29, 29, 29)"
                                                },
                                            ]}
                                            placeholder="Write a caption..."
                                            placeholderTextColor={isDarkMode ? "rgb(185, 185, 185)" : "rgb(142, 142, 142)"}
                                            value={formikProps.values.caption}
                                            keyboardAppearance={isDarkMode ? "dark" : "light"}
                                            onChangeText={formikProps.handleChange('caption')}
                                            onBlur={(e) => {
                                                formikProps.handleBlur('caption')(e);
                                                setIsCaptionFocused(false);
                                            }}
                                            onFocus={() => setIsCaptionFocused(true)}
                                            returnKeyType="default"
                                            multiline={true}
                                            maxLength={MAX_CAPTION_LENGTH}
                                            inputAccessoryViewID="captionInputAccessory"
                                            enablesReturnKeyAutomatically={true}
                                        />
                                        {formikProps.values.caption.length > 0 && (
                                            <Pressable 
                                                style={stylesAddEntryScreen.clearCaptionButton}
                                                onPress={() => formikProps.handleChange('caption')('')}
                                            >
                                                <Ionicons 
                                                    name="close-circle" 
                                                    size={20} 
                                                    color={isDarkMode ? "#ffffff" : "#262626"} 
                                                />
                                            </Pressable>
                                        )}
                                        <Text style={[
                                            stylesAddEntryScreen.characterCount,
                                            { color: isDarkMode ? "rgb(185, 185, 185)" : "rgb(142, 142, 142)" }
                                        ]}>
                                            {getActualCharacterCount(formikProps.values.caption)}/{MAX_CAPTION_LENGTH}
                                        </Text>
                                    </View>
                                    {formikProps.touched.caption && formikProps.errors.caption && (
                                        <Text style={[stylesAddEntryScreen.errorText, { color: '#ff3b30' }]}>
                                            {formikProps.errors.caption}
                                        </Text>
                                    )}
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
                                                    backgroundColor: location 
                                                    ? "rgb(210, 33, 33)" 
                                                    : ( isDarkMode ? 
                                                        "rgb(29, 29, 29)" : 
                                                        "rgb(253, 253, 253)"),

                                                    borderColor: location 
                                                    ? "rgb(210, 33, 33)" 
                                                    : (isDarkMode ? 
                                                        "rgb(253, 253, 253)" : 
                                                        "rgb(29, 29, 29)"),

                                                    color: location 
                                                    ? "rgb(253, 253, 253)" 
                                                    : (isDarkMode ? 
                                                        "rgb(223, 223, 223)" : 
                                                        "rgb(29, 29, 29)"),
                                                },
                                                pressed && { opacity: 0.7 }
                                            ]}
                                            onPress={location ? removeLocation : getLocation}
                                            disabled={isLoadingLocation}
                                        >
                                            <Ionicons 
                                                name={location ? "close" : "location"} 
                                                size={20} 
                                                color={location 
                                                ? "rgb(253, 253, 253)" 
                                                : (isDarkMode ? 
                                                    "rgb(223, 223, 223)" : 
                                                    "rgb(29, 29, 29)")}
                                            />
                                            <Text style={[stylesAddEntryScreen.locationButtonText, { 
                                                color: location 
                                                ? "rgb(253, 253, 253)" 
                                                : (isDarkMode ? 
                                                    "rgb(223, 223, 223)" : 
                                                    "rgb(29, 29, 29)")
                                            }]}>
                                                {isLoadingLocation ? "Getting location..." : location ? "Remove Location" : "Get Current Location"}
                                            </Text>
                                            {isLoadingLocation && (
                                                <ActivityIndicator size="small" color="#0095f6" style={{ marginLeft: 5 }} />
                                            )}
                                        </Pressable>
                                    </View>
                                    
                                    {location && (
                                        <View style={[stylesAddEntryScreen.locationDetails, {
                                            backgroundColor: isDarkMode ? 
                                                "rgb(60, 60, 60)" : 
                                                "rgb(240, 240, 240)", 
                                            borderColor: isDarkMode ? 
                                                "rgb(60, 60, 60)" :
                                                "rgb(240, 240, 240)" 
                                        }]}>
                                            <Text style={[stylesAddEntryScreen.locationAddress, {
                                                color: isDarkMode ? 
                                                    "rgb(223, 223, 223)" : 
                                                    "rgb(29, 29, 29)"
                                            }]}>
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
                                            "rgb(31, 25, 4)" 
                                        },
                                        { borderColor: isDarkMode ? 
                                            "rgb(253, 253, 253)" : 
                                            "rgb(29, 29, 29)" 
                                        },
                                        { opacity: pressed ? 0.7 : images.length === 0 ? 0.5 : 1 }
                                    ]}
                                    onPress={() => formikProps.handleSubmit()}
                                    disabled={images.length === 0}
                                >   
                                    <Ionicons name="eye" size={24} color={isDarkMode ? 
                                        "rgb(29, 29, 29)" : 
                                        "rgb(223, 223, 223)" } />
                                    <Text style={[
                                        stylesAddEntryScreen.nextButtonText, 
                                        { color: isDarkMode ? 
                                            "rgb(29, 29, 29)" : 
                                            "rgb(223, 223, 223)" }
                                        ]}>
                                        Preview
                                    </Text>
                                </Pressable>

                                <Pressable 
                                    style={({ pressed }) => [
                                        stylesAddEntryScreen.captureButton,
                                        { backgroundColor: isDarkMode ? 
                                            "rgb(29, 29, 29)" : 
                                            "rgb(253, 253, 253)" 
                                        }, 
                                        {
                                            borderColor: isDarkMode ? 
                                            "rgb(223, 223, 223)":
                                            "rgb(29, 29, 29)" 
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
                                            "rgb(223, 223, 223)" : 
                                            "rgb(53, 43, 4)"}
                                    />
                                    <Text style={[stylesAddEntryScreen.cameraButtonText, { 
                                        color: isDarkMode ? 
                                            "rgb(223, 223, 223)" : 
                                            "rgb(53, 43, 4)",
                                        opacity: images.length >= MAX_IMAGES ? 0.5 : 1
                                    }]}>
                                        Take Photo
                                    </Text>
                                </Pressable>
                            </View>
                        </>
                    </TouchableWithoutFeedback>
                    {Platform.OS === 'ios' && (
                        <InputAccessoryView nativeID="captionInputAccessory">
                            <View style={[
                                stylesAddEntryScreen.inputAccessoryView,
                                { backgroundColor: isDarkMode ? 
                                    'rgb(29, 29, 29)' : 
                                    'rgb(253, 253, 253)', 
                                    borderColor: isDarkMode ? 
                                        'rgb(68, 68, 68)' : 
                                        'rgb(227, 227, 227)' 
                                }
                            ]}>
                                <Pressable
                                    style={stylesAddEntryScreen.doneButton}
                                    onPress={() => Keyboard.dismiss()}
                                >
                                    <Text style={[
                                        stylesAddEntryScreen.doneButtonText,
                                        { color: isDarkMode ? 'rgb(223, 223, 223)' : 'rgb(29, 29, 29)' }
                                    ]}>
                                        Done
                                    </Text>
                                </Pressable>
                            </View>
                        </InputAccessoryView>
                    )}
                </View>
            )}
        </Formik>
    );
};

export default AddEntryScreen;
