import React, { createContext, useState, useContext } from 'react';
import * as Location from 'expo-location';

interface CameraContextType {
  camera: any;
  setCamera: (camera: any) => void;
  takePicture: () => Promise<{ uri: string; location: string }>;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [camera, setCamera] = useState<any>(null);

  const takePicture = async () => {
    if (camera) {
      try {
        const photo = await camera.takePictureAsync();
        const currentLocation = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        const formattedAddress = address[0]
          ? `${address[0].street}, ${address[0].city}, ${address[0].country}`
          : "Location not available";

        return { uri: photo.uri, location: formattedAddress };
      } catch (error) {
        throw new Error("Failed to take picture or get location");
      }
    }
    throw new Error("Camera not available");
  };

  return (
    <CameraContext.Provider value={{ camera, setCamera, takePicture }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}; 