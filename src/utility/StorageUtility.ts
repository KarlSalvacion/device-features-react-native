import AsyncStorage from "@react-native-async-storage/async-storage";
import { TravelEntry } from "../types/TravelEntry";

export const loadTravelEntries = async (): Promise<TravelEntry[]> => {
  try {
    const storedEntries = await AsyncStorage.getItem("travelEntries");
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch (error) {
    console.error("Error loading entries:", error);
    return [];
  }
};

export const saveTravelEntries = async (entries: TravelEntry[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem("travelEntries", JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error("Error saving entries:", error);
    return false;
  }
};

export const removeEntry = async (entries: TravelEntry[], id: string): Promise<TravelEntry[]> => {
  try {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    await saveTravelEntries(updatedEntries);
    return updatedEntries;
  } catch (error) {
    console.error("Error removing entry:", error);
    return entries;
  }
};

export const toggleLikeEntry = async (entries: TravelEntry[], id: string): Promise<TravelEntry[]> => {
  try {
    const updatedEntries = entries.map(entry => {
      if (entry.id === id) {
        const currentLikeCount = typeof entry.likeCount === 'number' ? entry.likeCount : 0;
        const newIsLiked = !entry.isLiked;
        return { 
          ...entry, 
          isLiked: newIsLiked,
          likeCount: newIsLiked ? currentLikeCount + 1 : currentLikeCount - 1
        };
      }
      return entry;
    });
    
    await saveTravelEntries(updatedEntries);
    return updatedEntries;
  } catch (error) {
    console.error("Error updating like status:", error);
    return entries;
  }
}; 