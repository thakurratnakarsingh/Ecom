import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Platform, PermissionsAndroid } from 'react-native';
import CameraModule from '../bridges/CameraModule';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { red } from 'react-native-reanimated/lib/typescript/Colors';

const conditions = ['New', 'Good', 'Average', 'Damaged'];

const ProofOfDeliveryScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [condition, setCondition] = useState(conditions[0]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to save photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      Alert.alert('Permission Error', 'Failed to request permission.');
      return false;
    }
  };

  const launchCamera = async () => {
    setLoading(true);
    try {
      let uri;
      if (Platform.OS === "android") {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          Alert.alert('Permission Denied', 'Storage permission is required to take photos.');
          setLoading(false);
          return;
        }
        uri = await CameraModule.launchCamera();
        console.log('Captured Image URI:', uri);
        setImageUri(uri);
      }
    } catch (e: any) {
      console.log('Camera error:', e?.message);
      Alert.alert('Camera Error', e?.message || 'Could not launch camera.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert('Missing Photo', 'Please take a photo of the delivered item.');
      return;
    }
    if (rating === 0) {
      Alert.alert('Missing Rating', 'Please rate the delivered item.');
      return;
    }
    // Simulate API call
    setLoading(true);
    try {
      const payload = {
        imageUri,
        rating,
        condition,
        feedback,
        submittedAt: new Date().toISOString(),
      };
      // Simulate network delay
      await new Promise(res => setTimeout(res, 1500));
      // Log to console (simulate storing/submitting)
      console.log('Proof of Delivery Submitted:', payload);
      Alert.alert('Submitted', 'Thank you for your feedback!');
      // Optionally reset form
      setImageUri(null);
      setRating(0);
      setCondition(conditions[0]);
      setFeedback('');
    } catch (e) {
      Alert.alert('Error', 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('proof.title')}</Text>
      <TouchableOpacity style={styles.cameraButton} onPress={launchCamera} disabled={loading}>
        <Text style={styles.cameraButtonText}>{imageUri ? t('proof.retakePhoto') : t('proof.takePhoto')}</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Text style={styles.label}>{t('proof.rate')}</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(i => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Text style={[styles.star, rating >= i && styles.starSelected]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>{t('proof.condition')}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={condition}
          onValueChange={setCondition}
          style={styles.picker}
        >
          {conditions.map(c => (
            <Picker.Item key={c} label={c} value={c} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>{t('proof.feedback')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('proof.feedback')}
        value={feedback}
        onChangeText={setFeedback}
        multiline
        numberOfLines={3}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{t('proof.submit')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  cameraButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  cameraButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    fontSize: 32,
    color: '#ccc',
    marginHorizontal: 4,
  },
  starSelected: {
    color: '#FFD700',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    minHeight: 40, // Add a minimum height to ensure text is not cut off
    justifyContent: 'center', // Vertically center the picker
  },
  picker: {
    height: 48, // Increase height for better visibility
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
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

export default ProofOfDeliveryScreen;
