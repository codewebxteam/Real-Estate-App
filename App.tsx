import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Navigation } from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { Colors } from './src/constants/colors';

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <Navigation />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
