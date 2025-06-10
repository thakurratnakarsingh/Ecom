import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

interface FilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  selectedMinPrice: number;
  selectedMaxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

const Filter: React.FC<FilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  selectedMinPrice,
  selectedMaxPrice,
  onPriceChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category:</Text>
      <Picker
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={onCategoryChange}
      >
        <Picker.Item label="All" value="" />
        {categories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
      <Text style={styles.label}>Price Range: ${selectedMinPrice} - ${selectedMaxPrice}</Text>
      <Slider
        style={styles.slider}
        minimumValue={minPrice}
        maximumValue={maxPrice}
        value={selectedMinPrice}
        onValueChange={(val) => onPriceChange(val, selectedMaxPrice)}
        step={1}
      />
      <Slider
        style={styles.slider}
        minimumValue={minPrice}
        maximumValue={maxPrice}
        value={selectedMaxPrice}
        onValueChange={(val) => onPriceChange(selectedMinPrice, val)}
        step={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  picker: {
    height: 40,
    marginBottom: 8,
    padding: 25,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 8,
  },
});

export default Filter; 