import React, { useState, useEffect, useRef } from "react";
import { View, Text,  Alert, ActivityIndicator, Image } from "react-native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Callout } from "react-native-maps";
import stylesMapScreen from "../styles/StylesMapScreen";

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

const MapScreen = () => {
    const { isDarkMode } = useTheme();
    const [entries, setEntries] = useState<TravelEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [mapError, setMapError] = useState<string | null>(null);
    const mapRef = useRef<MapView | null>(null);
    const [initialRegion, setInitialRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            setLoading(true);
            const storedEntries = await AsyncStorage.getItem("travelEntries");
            if (storedEntries) {
                const parsedEntries: TravelEntry[] = JSON.parse(storedEntries);
                setEntries(parsedEntries);
                
                // Set initial region to the first entry with location or default
                const entriesWithLocation = parsedEntries.filter(entry => entry.location);
                if (entriesWithLocation.length > 0) {
                    const firstEntry = entriesWithLocation[0];
                    setInitialRegion({
                        latitude: firstEntry.location!.latitude,
                        longitude: firstEntry.location!.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                }
            }
            console.log(`Found ${entriesWithLocation.length} entries with location data`);
        } catch (error) {
            console.error("Error loading entries for map:", error);
            Alert.alert("Error", "Failed to load entries for map");
        } finally {
            setLoading(false);
        }
    };

    const entriesWithLocation = entries.filter(entry => entry.location);

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
            <MapView
                ref={mapRef}
                style={stylesMapScreen.map}
                initialRegion={initialRegion}
            >
                {entriesWithLocation.map((entry) => (
                    <Marker
                        key={entry.id}
                        coordinate={{
                            latitude: entry.location!.latitude,
                            longitude: entry.location!.longitude,
                        }}
                    >
                        <Callout tooltip style={stylesMapScreen.customCallout}>
                            <View style={stylesMapScreen.calloutContainer}>
                                <Image 
                                    source={{ uri: entry.images[0] }} 
                                    style={stylesMapScreen.calloutImage} 
                                />
                                <Text style={stylesMapScreen.calloutTitle} numberOfLines={2}>
                                    {entry.caption}
                                </Text>
                                <Text style={stylesMapScreen.calloutAddress} numberOfLines={1}>
                                    {entry.location!.address}
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
