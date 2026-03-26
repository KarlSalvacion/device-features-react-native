import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CameraProvider } from './context/CameraContext';
import NavigationControl from './navigation/NavigationControl';
import stylesGlobal from './styles/screens/StylesGlobal';

const AppContent = () => {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[
      stylesGlobal.container, 
      { backgroundColor: isDarkMode ? 
        'rgb(29, 29, 29)' : 
        'rgb(253, 253, 253)' 
        }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer>
        <NavigationControl />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <CameraProvider>
          <AppContent />
        </CameraProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;

