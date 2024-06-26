import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { showToast } from '../component/CustomToast';

const PaymentSuccess = ({ navigation }) => {
  const [typedText, setTypedText] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const text = 'Thank You!';
    let currentIndex = 0;

    const timer = setInterval(() => {
      setTypedText(text.substring(0, currentIndex));
      currentIndex++;

      if (currentIndex > text.length) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {

      // navigation.navigate('HomePage');
    }, 1000);
    showToast(
      'success',
      t('registeredsuccessfully'),
      2500,
    );
    return () => clearTimeout(timer);
  }, [navigation]);

  const OnpressHanddle = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.circle}>
          <Image
            style={styles.boxImage}
            source={require('../assets/paymentsuccess.png')}
            alt="Success"
          />
        </View>
        <Text style={styles.thanks}>{typedText}</Text>
        <Text style={styles.payment}>{t('paymentDoneSuccessfully')}</Text>
        <Pressable style={styles.button} onPress={OnpressHanddle}>
          <Text style={styles.btntext}>GO TO LOGIN PAGE</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dae4f0',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 40,
    width: 290,
    backgroundColor: '#18bd5b',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  btntext: {
    color: 'white',
    fontSize: 20,
    textTransform: 'capitalize',
  },
  thanks: {
    color: '#008b02',
    fontSize: 50,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  payment: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50,
  },
  boxImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
