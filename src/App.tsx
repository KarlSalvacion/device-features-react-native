import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CameraProvider } from './context/CameraContext';
import { NotificationsProvider } from './context/NotificationsContext';
import NavigationControl from './navigation/NavigationControl';
import stylesGlobal from './styles/StylesGlobal';

const AppContent = () => {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[stylesGlobal.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }]}>
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
      <NotificationsProvider>
        <CameraProvider>
          <AppContent />
        </CameraProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
};

export default App;

