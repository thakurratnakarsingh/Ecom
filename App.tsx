/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { enableScreens } from 'react-native-screens';
import { CartProvider } from './src/context/CartContext';
import { ThemeProvider } from './src/context/ThemeContext';
import './src/i18n';

enableScreens();
export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </ThemeProvider>
  );
}
