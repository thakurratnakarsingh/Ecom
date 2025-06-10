import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProofOfDeliveryScreen from '../screens/ProofOfDeliveryScreen';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Cart: undefined;
  Register: undefined;
  ProofOfDelivery: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const { toggleTheme, theme } = useTheme();
  const { t, i18n } = useTranslation();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      <View style={{ marginTop: 24 }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20 }}
          onPress={() => props.navigation.navigate('Cart')}
        >
          <Icon name="cart-outline" size={24} color="#007bff" style={{ marginRight: 18 }} />
          <Text style={{ fontSize: 16, color: '#222' }}>{t('home.goToCart')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20 }}
          onPress={() => props.navigation.navigate('ProofOfDelivery')}
        >
          <Icon name="camera" size={24} color="#007bff" style={{ marginRight: 18 }} />
          <Text style={{ fontSize: 16, color: '#222' }}>{t('proof.title') || 'Proof of Delivery'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20 }}
          onPress={toggleTheme}
        >
          <Icon name={theme === 'dark' ? 'white-balance-sunny' : 'weather-night'} size={24} color="#333" style={{ marginRight: 18 }} />
          <Text style={{ fontSize: 16, color: '#222' }}>{theme === 'dark' ? t('home.switchToLight') : t('home.switchToDark')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20 }}
          onPress={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
        >
          <Icon name="translate" size={24} color="#333" style={{ marginRight: 18 }} />
          <Text style={{ fontSize: 16, color: '#222' }}>{i18n.language === 'en' ? 'हिन्दी' : 'English'}</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

function HomeStack() {
  const { items } = useCart();
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitle: () => <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center', flex: 1 }}>{t('home.goToCart').replace('Go to Cart', 'Home')}</Text>,
        headerLeft: () => (
          <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => navigation.getParent()?.openDrawer()}>
            <Icon name="menu" size={28} color="#007bff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 16 }} onPress={() => navigation.navigate('Cart')}>
            <View>
              <Icon name="cart-outline" size={28} color="#007bff" />
              {items.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{items.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ),
        headerTitleAlign: 'center',
      })}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerTitle: 'Home' }} />
      <Stack.Screen name="ProofOfDelivery" component={ProofOfDeliveryScreen} options={{ headerTitle: 'Proof of Delivery' }} />
    </Stack.Navigator>
  );
}

// Fix CartStack: use 'Cart' as the screen name to match RootStackParamList
function CartStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitle: () => <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center', flex: 1 }}>{t('cart.yourCart')}</Text>,
        headerLeft: () => (
          <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="#007bff" />
          </TouchableOpacity>
        ),
        headerTitleAlign: 'center',
      })}
    >
      <Stack.Screen name="Cart" component={CartScreen} options={{ headerTitle: t('cart.yourCart') }} />
    </Stack.Navigator>
  );
}

function ProofOfDeliveryStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitle: () => <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center', flex: 1 }}>{t('proof.title') || 'Proof of Delivery'}</Text>,
        headerLeft: () => (
          <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="#007bff" />
          </TouchableOpacity>
        ),
        headerTitleAlign: 'center',
      })}
    >
      <Stack.Screen name="ProofOfDelivery" component={ProofOfDeliveryScreen} options={{ headerTitle: t('proof.title') || 'Proof of Delivery' }} />
    </Stack.Navigator>
  );
}

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
  const navigationRef = useNavigationContainerRef();

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Listen to navigation state changes to re-check auth (after login/register)
  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', checkAuth);
    return () => unsubscribe();
  }, [navigationRef]);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticated ? (
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}
          screenOptions={{ headerShown: false }}>
          <Drawer.Screen name="Home" component={HomeStack} />
          <Drawer.Screen name="Cart" component={CartStack} />
          <Drawer.Screen name="ProofOfDelivery" component={ProofOfDeliveryStack} />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {props => (
              <LoginScreen
                {...props}
                onLoginSuccess={() => setIsAuthenticated(true)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -0,
    top: -0,
    backgroundColor: '#007bff',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default AppNavigator;