import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: {
        goToCart: 'Go to Cart',
        switchToLight: 'Switch to Light Mode',
        switchToDark: 'Switch to Dark Mode',
        addToCart: 'Add to Cart',
      },
      cart: {
        yourCart: 'Your Cart',
        empty: 'Your cart is empty.',
        total: 'Total:',
        remove: 'Remove',
      },
      proof: {
        title: 'Proof of Delivery',
        takePhoto: 'Take Photo',
        retakePhoto: 'Retake Photo',
        rate: 'Rate the item:',
        condition: 'Condition:',
        feedback: 'Feedback (optional):',
        submit: 'Submit',
        submitted: 'Thank you for your feedback!',
        missingPhoto: 'Please take a photo of the delivered item.',
        missingRating: 'Please rate the delivered item.',
      },
    },
  },
  hi: {
    translation: {
      home: {
        goToCart: 'कार्ट पर जाएं',
        switchToLight: 'लाइट मोड पर स्विच करें',
        switchToDark: 'डार्क मोड पर स्विच करें',
        addToCart: 'कार्ट में जोड़ें',
      },
      cart: {
        yourCart: 'आपका कार्ट',
        empty: 'आपका कार्ट खाली है।',
        total: 'कुल:',
        remove: 'हटाएं',
      },
      proof: {
        title: 'डिलीवरी का प्रमाण',
        takePhoto: 'फोटो लें',
        retakePhoto: 'फिर से फोटो लें',
        rate: 'आइटम को रेट करें:',
        condition: 'स्थिति:',
        feedback: 'प्रतिक्रिया (वैकल्पिक):',
        submit: 'सबमिट करें',
        submitted: 'आपकी प्रतिक्रिया के लिए धन्यवाद!',
        missingPhoto: 'कृपया डिलीवर किए गए आइटम की फोटो लें।',
        missingRating: 'कृपया डिलीवर किए गए आइटम को रेट करें।',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
