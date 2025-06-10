import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import Filter from '../components/Filter';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTranslation } from 'react-i18next';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedMinPrice, setSelectedMinPrice] = useState(0);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
        // Set price range
        const prices = data.map((p: Product) => p.price);
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        setMinPrice(min);
        setMaxPrice(max);
        setSelectedMinPrice(min);
        setSelectedMaxPrice(max);
      } catch (e) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products/categories');
        const data = await res.json();
        setCategories(data);
      } catch (e) {}
    };
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    filtered = filtered.filter(
      (p) => p.price >= selectedMinPrice && p.price <= selectedMaxPrice
    );
    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedMinPrice, selectedMaxPrice]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, theme === 'dark' && { backgroundColor: '#181818' }]}>
      <Filter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        selectedMinPrice={selectedMinPrice}
        selectedMaxPrice={selectedMaxPrice}
        onPriceChange={(min, max) => {
          setSelectedMinPrice(min);
          setSelectedMaxPrice(max);
        }}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToCart({ id: item.id, title: item.title, price: item.price, image: item.image })}
              >
                <Text style={styles.addButtonText}>{t('home.addToCart')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  addButton: {
    marginTop: 8,
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;