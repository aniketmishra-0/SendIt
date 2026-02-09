import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, useColorScheme } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import RoomScreen from './src/screens/RoomScreen';
import { generateRoomCode, signalingService } from './src/services/P2PService';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

type Screen = 'home' | 'room';

function AppContent() {
  const { theme, isDark } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [roomCode, setRoomCode] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);

  const handleCreateRoom = async () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    setCurrentScreen('room');
  };

  const handleJoinRoom = (code: string) => {
    if (code.length === 6) {
      setRoomCode(code.toUpperCase());
      setIsHost(false);
      setCurrentScreen('room');
    }
  };

  const handleLeaveRoom = () => {
    signalingService.disconnect();
    setRoomCode('');
    setIsHost(false);
    setCurrentScreen('home');
  };

  const dynamicStyles = StyleSheet.create({
    safeAreaProvider: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <SafeAreaProvider style={dynamicStyles.safeAreaProvider}>
      <StatusBar style={isDark ? 'light' : 'dark'} translucent={true} backgroundColor="transparent" />
      <View style={dynamicStyles.container}>
        {currentScreen === 'home' ? (
          <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
        ) : (
          <RoomScreen roomCode={roomCode} isHost={isHost} onLeave={handleLeaveRoom} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// Static fallback styles (for initial load)
const styles = StyleSheet.create({
  safeAreaProvider: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
});
