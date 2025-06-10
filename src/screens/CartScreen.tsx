import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

const CartScreen = () => {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('cart.yourCart')}</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>{t('cart.empty')}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Text style={styles.qtyButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.removeButtonText}>{t('cart.remove')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{t('cart.total')}</Text>
        <Text style={styles.totalValue}>${getTotal().toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    alignSelf: 'center',
  },
  empty: {
    fontSize: 18,
    color: '#888',
    alignSelf: 'center',
    marginTop: 40,
  },
  cartItem: {
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
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    backgroundColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginHorizontal: 4,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 6,
  },
  removeButton: {
    marginLeft: 12,
    backgroundColor: '#dc3545',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  themeButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 8,
  },
  themeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartScreen;