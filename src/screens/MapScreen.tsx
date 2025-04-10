import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert, ActivityIndicator, Image } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Callout } from "react-native-maps";
import stylesMapScreen from "../styles/screens/StylesMapScreen";
import { TravelEntry, formatPostDate } from "../types/TravelEntry";
import { loadTravelEntries } from "../utility/StorageUtility";
import { useNavigation } from "@react-navigation/native";

const MapScreen = () => {
    const { isDarkMode } = useTheme();
    const [entries, setEntries] = useState<TravelEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [mapError, setMapError] = useState<string | null>(null);
    const mapRef = useRef<MapView | null>(null);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [initialRegion, setInitialRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const navigation = useNavigation();

    useEffect(() => {
        loadEntriesForMap();
        
        const unsubscribe = navigation.addListener('focus', () => {
            loadEntriesForMap();
        });
        
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        
        return () => {
            unsubscribe();
            clearInterval(timeInterval);
        };
    }, [navigation]);

    const loadEntriesForMap = async () => {
        try {
            setLoading(true);
            const loadedEntries = await loadTravelEntries();
            setEntries(loadedEntries);
            
            const entriesWithLocation = loadedEntries.filter(entry => 
                typeof entry.location === 'object' && 
                entry.location !== null && 
                'latitude' in entry.location && 
                'longitude' in entry.location
            );
            if (entriesWithLocation.length > 0) {
                const firstEntry = entriesWithLocation[0];
                const location = firstEntry.location as { latitude: number; longitude: number };
                setInitialRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            }
        } catch (error) {
            console.error("Error loading entries for map:", error);
            Alert.alert("Error", "Failed to load entries for map");
            setMapError("Failed to load map data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const entriesWithLocation = entries.filter(
        entry => entry.location && typeof entry.location !== 'string'
    ) as Array<TravelEntry & { 
        location: { latitude: number; longitude: number; address: string } 
    }>;

    if (loading) {
        return (
            <View style={[stylesMapScreen.loadingContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }]}>
                <ActivityIndicator size="large" color="#0095f6" />
                <Text style={{ 
                    color: isDarkMode ? '#ffffff' : '#000000',
                    marginTop: 12
                }}>
                    Loading map data...
                </Text>
            </View>
        );
    }

    if (mapError) {
        return (
            <View style={[stylesMapScreen.errorContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }]}>
                <Ionicons name="warning" size={40} color={isDarkMode ? '#ff6b6b' : '#ff4757'} />
                <Text style={{ 
                    color: isDarkMode ? '#ffffff' : '#000000',
                    fontSize: 18,
                    marginTop: 12,
                    textAlign: 'center'
                }}>
                    {mapError}
                </Text>
            </View>
        );
    }

    if (entriesWithLocation.length === 0) {
        return (
            <View style={[stylesMapScreen.emptyContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }]}>
                <Ionicons name="location" size={40} color={isDarkMode ? '#555555' : '#cccccc'} />
                <Text style={{ 
                    color: isDarkMode ? '#ffffff' : '#000000',
                    fontSize: 18,
                    marginTop: 12
                }}>
                    No photos with location data
                </Text>
                <Text style={{ 
                    color: isDarkMode ? '#aaaaaa' : '#666666',
                    fontSize: 14,
                    marginTop: 8,
                    textAlign: 'center'
                }}>
                    Add locations to your photos to see them on the map
                </Text>
            </View>
        );
    }

    return (
        <View style={stylesMapScreen.container}>
            <View style={[stylesMapScreen.headerContainer, { 
                backgroundColor: isDarkMode ? 
                    'rgb(29, 29, 29)' : 
                    'rgb(253, 253, 253)' }
                ]}>
                <Text style={[stylesMapScreen.headerTitle, { 
                    color: isDarkMode ? 
                    "rgb(223, 223, 223)" : 
                    "rgb(29, 29, 29)" }
                ]}>
                    Map
                </Text>
            </View>
            <MapView
                ref={mapRef}
                style={stylesMapScreen.map}
                initialRegion={initialRegion}
                mapType="hybrid"
                
            >
                {entriesWithLocation.map((entry) => (
                    <Marker
                        key={entry.id}
                        coordinate={{
                            latitude: entry.location.latitude,
                            longitude: entry.location.longitude,
                        }}
                        onPress={() => {
                            mapRef.current?.animateToRegion({
                                latitude: entry.location.latitude,
                                longitude: entry.location.longitude,
                                latitudeDelta: 0.001,
                                longitudeDelta: 0.001,
                            }, 800);
                        }}
                    >
                        <View style={stylesMapScreen.markerContainer}>
                            <View style={stylesMapScreen.thumbnailMarker}>
                                <Image
                                    source={{ uri: entry.images[0] }}
                                    style={stylesMapScreen.thumbnailImage}
                                />
                            </View>
                            <View style={stylesMapScreen.arrowDown} />
                        </View>
                        <Callout>
                            <View style={stylesMapScreen.calloutContainer}>
                                <Text style={stylesMapScreen.calloutCaption}>
                                    {entry.caption}
                                </Text>
                                <Text style={stylesMapScreen.calloutDate}>
                                    {formatPostDate(entry.datePosted || new Date().toISOString())}
                                </Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
};

export default MapScreen;
