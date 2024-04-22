import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  PermissionsAndroid,
  PermissionsIOS,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'react-native-image-picker';

import { API_BASE_URL, IMAGE_URL } from '@env';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import AgeCount from '../component/AgeCount';
import { showToast } from '../component/CustomToast';
import api from '../Utils/api';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const ProfilePage = () => {
  const navigation = useNavigation();
  const [parentsData, setParentsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownLoading, setIsDownLoading] = useState(false);
  const [villageData, setVillageData] = useState([]);
  const [image, setImage] = useState("");
  const { t } = useTranslation();


  // Get items from asyncStorage
  useEffect(() => {
    // Get userData
    const final = AsyncStorage.getItem('userData')
      .then(value => {
        if (value) {
          const userData = JSON.parse(value);
          setParentsData(userData);
        }
      })
      .catch(error => {
        console.error('Error in profile page : ', error);
      });

    // Get village data
    const location = AsyncStorage.getItem('villageData')
      .then(value => {
        if (value) {
          const villageData = JSON.parse(value);
          setVillageData(villageData);
        }
      })
      .catch(error => {
        console.error('Error in profile page : ', error);
      });
  }, []);

  const age = AgeCount(parentsData && parentsData?.dob);
  const formattedDate = moment(parentsData && parentsData?.dob).format(
    'DD/MM/YYYY',
  );

  const selectImage = async () => {
    try {
      if (Platform.OS == "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Downloader App Storage Permission',
            message:
              'Downloader App needs access to your storage' +
              'so you can download files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

          const image = await launchImageLibrary({
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: true,
          })
          if (image.didCancel) throw new Error("User canceled ImagePicker")

          const userData = new FormData();
          const imagePath = image.assets[0].uri;
          const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
          const fileType = image.assets[0].type;

          setImage(imagePath);
          userData.append('image', {
            uri: imagePath,
            type: fileType,
            name: fileName,
          });

          setIsLoading(true);
          const response = await api
            .post(`/profile_image/${parentsData?._id}`, userData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
              },
            })
          await AsyncStorage.removeItem('userData')
          const userDataWithImage = JSON.stringify(response.data);
          await AsyncStorage.setItem('userData', userDataWithImage);
          setIsLoading(true);
          setParentsData('');
          navigation.navigate('HomePage');
          navigation.navigate('ProfilePage');
          showToast('success', t('profileimageupdatedsuccessfully'), 2500);
          setIsLoading(false);
        }
      }
      else {
        /*  const cameraPermission = await PermissionsIOS.request('camera');
         const photoLibraryPermission = await PermissionsIOS.request('photoLibrary');
 
         if (cameraPermission === 'granted' && photoLibraryPermission === 'granted') { */
        const options = {
          mediaType: 'photo',
          quality: 0.5,
          includeBase64: true,
        };

        await launchImageLibrary(options, (response) => {
          if (response.didCancel) {
            showToast('success', 'User canceled ImagePicker', 2500);
            // throw new Error('User canceled ImagePicker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            const userData = new FormData();
            const imagePath = response.assets[0].uri;
            const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
            const fileType = response.assets[0].type;

            userData.append('image', {
              uri: imagePath,
              type: fileType,
              name: fileName,
            });



            setIsLoading(true);
            api.post(`/profile_image/${parentsData?._id}`, userData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
              },
            })
              .then(async (response) => {

                await AsyncStorage.removeItem('userData');
                const userDataWithImage = JSON.stringify(response.data);
                await AsyncStorage.setItem('userData', userDataWithImage);
                setIsLoading(false);
                setParentsData('');
                navigation.navigate('HomePage');
                navigation.navigate('ProfilePage');
                showToast('success', t('profileimageupdatedsuccessfully'), 2500);
              })
              .catch((error) => {
                console.error('Error uploading profile image:', error);
                setIsLoading(false);
                Alert.alert('Error', 'Failed to update profile image');
              });
          }
        });
        /*  } else {
           Alert.alert('Permission Denied', 'Please grant access to camera and photo library to update profile image');
         } */
      }
    } catch (error) {
      setIsLoading(false);
      console.error('ImagePicker Error:', error);
    }
  };
  const requestStoragePermission = async (id) => {
    try {
      if (Platform.OS == 'ios') {
        actualDownload(id);
      }
      else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Downloader App Storage Permission',
            message:
              'Downloader App needs access to your storage' +
              'so you can download files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadFile(id);
        }
      }

    } catch (err) {
      console.warn(err);
    }
  };
  const actualDownload = (id) => {
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = dirs.DocumentDir
    /*    const configfb = {
           useDownloadManager: true,
           notification: true,
           mediaScannable: true,
           path: dirToSave + 
           '/'+
           Math.floor(date.getDate() + date.getSeconds() / 2) +
           '.pdf',
         
       } */
    var currentDate = new Date();
    var fileName = Math.floor(currentDate.getDate() + currentDate.getSeconds() / 2) + '.pdf';
    const configOptions = {
      path: dirToSave + '/' + fileName,
      appendExt: 'pdf',
    }


    RNFetchBlob.config(configOptions)
      .fetch('GET', `${API_BASE_URL}/paymentReceipt/${id}`, {})
      .then((res) => {

        RNFetchBlob.ios.previewDocument(configOptions.path);

        setIsDownLoading(false)

      })
      .catch((e) => {
        setIsDownLoading(true)

        console.log('The file saved to ERROR', e.message)
      });
  }
  const downloadFile = (id) => {

    setIsDownLoading(true);

    const { config, fs } = RNFetchBlob;
    const date = new Date();
    const fileDir = fs.dirs.DownloadDir;
    config({

      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          fileDir +
          '/download_' +
          Math.floor(date.getDate() + date.getSeconds() / 2) +
          '.pdf',
        description: 'file download',
      },
    })
      // api.get(`/paymentReceipt/${id}`)
      .fetch('GET', `${API_BASE_URL}/paymentReceipt/${id}`, {
        //some headers ..
      })
      .then(res => {
        // the temp file path
        showToast(
          'success',
          t('downloadsuccessfully'),
          2000,
        );
        setIsDownLoading(false);

      });
  };
  console.log(`${IMAGE_URL}/${parentsData?.photo}`, " :::hey")
  return (
    <ImageBackground source={require('../assets/bg3.jpg')} style={{ flex: 1 }} resizeMode="cover" >
      <View style={styles.maincontainer}>
        <View style={styles.container}>
          <View style={styles.img}>
            <Pressable onPress={selectImage}>
              <View style={styles.imageContainer}>
                {isLoading ? (
                  <View>
                    <ActivityIndicator size="large" color="#00a9ff" />
                  </View>
                ) : parentsData?.photo ? (
                  <View style={styles.imageIconContainer}>
                    <Image
                      source={{ uri: `${IMAGE_URL}/${parentsData?.photo}` }}
                      alt="profile"
                      style={styles.image}
                    />
                    <Text style={styles.imageIcon}>
                      <MaterialCommunityIcons
                        name="account-edit-outline"
                        size={30}
                        color="#fff"
                      />
                    </Text>
                  </View>
                ) : (
                  <View style={styles.imageIconContainer}>
                    <Image
                      source={require('../assets/3135715.png')}
                      alt="profile"
                      style={styles.image}
                    />
                    <Text style={styles.imageIcon}>
                      <MaterialCommunityIcons
                        name="camera-plus-outline"
                        size={25}
                        color="#fff"
                      />
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          </View>

          <View style={styles.main}>
            <Text style={styles.name}>
              {parentsData &&
                parentsData?.firstname + ' ' + parentsData?.lastname}
            </Text>
            <Text style={styles.personal_id}>
              {parentsData && parentsData?.personal_id}
            </Text>
          </View>

          <ScrollView>
            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>{t('dateofbirth')} :</Text>
                <Text style={styles.userInfo}>
                  {formattedDate} ( {age} years )
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>{t('mobile')} :</Text>
                <Text style={styles.userInfo}>
                  {parentsData && parentsData?.mobile_number}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>{t('education')} :</Text>
                <Text style={styles.userInfo}>
                  {parentsData && parentsData?.education}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>{t('gender')} :</Text>
                <Text style={styles.userInfo}>
                  {parentsData && parentsData?.gender}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>{t('profession')} :</Text>
                <Text style={styles.userInfo}>
                  {parentsData && parentsData?.job}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>{t('village')} :</Text>
                <Text style={styles.userInfo}>
                  {villageData ? villageData[0]?.village : '-'}
                </Text>
              </View>
            </View>
            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>{t('address')} :</Text>
                <Text style={styles.userInfo}>
                  {parentsData && parentsData?.address}
                </Text>
              </View>
            </View>
            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>{t('invoice')} :</Text>
                <TouchableOpacity
                  style={[styles.dlfamilybtn, isDownLoading && styles.disabledButton]}
                  onPress={() => requestStoragePermission(parentsData?._id)}
                  activeOpacity={0.6}
                  disabled={isDownLoading}>
                  {isDownLoading ? (
                    <>
                      <ActivityIndicator size="small" color="#fff" />
                    </>
                  ) : (
                    <Text style={styles.dlbtntext}>{t('download')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.btncontainer}>
            <TouchableOpacity
              style={styles.familybtn}
              onPress={() => navigation.navigate('FamilyDetailsPage')}
              activeOpacity={0.6}>
              <Text style={styles.btntext}>{t('familyMembers')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutbtn}
              onPress={() => navigation.navigate('ChangePassword')}
              activeOpacity={0.6}>
              <Text style={styles.btntext}>{t('changePassword')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: '#fff',
    height: '100%',
  },

  container: {
    width: '100%',
    height: '100%',
    // backgroundColor: '#dae4f0',
  },

  img: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    width: '100%',
  },

  imageContainer: {
    borderRadius: 100,
    backgroundColor: '#fff',
    overflow: 'hidden',
    // borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    zIndex: 1,
  },

  image: {
    width: 150,
    height: 150,
  },

  imageIconContainer: {
    display: 'flex',
    alignItems: 'center',
  },

  imageIcon: {
    width: '100%',
    height: 35,
    color: 'red',
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    backgroundColor: '#00000080',
  },

  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
  },

  name: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  personal_id: {
    fontSize: 17,
    color: 'black',
  },

  details: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginVertical: 5,
    marginHorizontal: 15,
    shadowColor: 'black',
    elevation: 3,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  label: {
    alignItems: 'flex-start',
    flexBasis: '40%',
    fontSize: 17,
    color: 'black',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  userInfo: {
    alignItems: 'flex-start',
    flexBasis: '60%',
    fontSize: 17,
    color: 'black',
    fontWeight: '400',
    textTransform: 'capitalize',
  },

  btncontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },

  familybtn: {
    height: 50,
    backgroundColor: '#68b300',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'gray',
    elevation: 3,
    width: '48%',
  },
  dlfamilybtn: {
    height: 35,
    backgroundColor: '#68b300',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'gray',
    elevation: 3,
    width: '48%',
  },

  logoutbtn: {
    height: 50,
    backgroundColor: '#ff0000',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'gray',
    elevation: 3,
    width: '48%',
  },

  btntext: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    // textTransform: 'uppercase',
  },
  dlbtntext: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    // textTransform: 'uppercase',
  },

  disabledButton: {
    backgroundColor: '#68b300',
  },
});

export default ProfilePage;
