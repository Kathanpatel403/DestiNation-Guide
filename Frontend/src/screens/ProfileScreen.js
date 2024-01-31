import React from "react";
import { View, Text, Image, TouchableOpacity, ToastAndroid } from "react-native";
import { useState, useEffect } from "react";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth, firestore, storage } from "../../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection } from "firebase/firestore";

import { ChevronLeftIcon } from "react-native-heroicons/solid";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Request permission to access the camera roll
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const userRoleRef = doc(firestore, "userRoles", uid);

      try {
        const docSnapshot = await getDoc(userRoleRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserData(data);
        } else {
          ToastAndroid.show("User data not found.", ToastAndroid.SHORT);
        }
      } catch (error) {
        ToastAndroid.show(`Error fetching user data: ${error}`, ToastAndroid.SHORT);
        console.error("Error fetching user data:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth)
        .then(() =>
          console.log("Successfully logged out!"));
      ToastAndroid.show(`Logged out successfully!`, ToastAndroid.SHORT);
      navigation.navigate("LogIn");
    } catch (error) {
      ToastAndroid.show(`Error logging out: ${error}`, ToastAndroid.SHORT);
      console.error("Error logging out:", error);
    }
  };

  const changePasswordHandler = async () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const userRoleRef = doc(firestore, "userRoles", uid);

      try {
        const docSnapshot = await getDoc(userRoleRef);

        if (docSnapshot.exists()) {
          const email = docSnapshot.data().email;
          await sendPasswordResetEmail(auth, email)
            .then(() => {
              ToastAndroid.show('Password reset link sent successfully!', ToastAndroid.SHORT)
              console.log('Password reset link sent successfully!')
            })
            .catch((error) => {
              ToastAndroid.show(`Error occurred: ${error.message}`, ToastAndroid.SHORT)
              console.error(`Error occurred: ${error.message}`)
            })
        } else {
          ToastAndroid.show("User data not found.", ToastAndroid.SHORT);
        }
      } catch (error) {
        ToastAndroid.show(`Error fetching user data: ${error}`, ToastAndroid.SHORT);
        console.error("Error fetching user data:", error);
      }
    }
  }

  const handleImagePress = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
          ToastAndroid.show('Permission to access media library denied', ToastAndroid.SHORT);
          return;
        }

        
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled) {
          uploadImage(result.uri);
        }
      } catch (error) {
        console.error('Error picking image:', error);
      }
    }
  };

  const uploadImage = async (uri) => {
    const user = auth.currentUser;

    if (user) {
      try {
  
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `userProfileImages/${user.uid}`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        const userRoleRef = doc(collection(firestore, 'userRoles'), user.uid);
        await updateDoc(userRoleRef, { photoURL: downloadURL });

        fetchUserData();
        ToastAndroid.show('Image uploaded successfully!', ToastAndroid.SHORT);
        console.log("Image uploaded successfully!");
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <View style="flex-1">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          padding: wp(4),
          marginLeft: wp(2),
          backgroundColor: "gray",
          borderRadius: wp(5),
          marginRight: wp(82),
          marginTop: wp(10),
        }}
      >
        <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleImagePress}>
      <Image
        style={{ width: 120, height: 120, marginTop: 40, marginLeft: 100, borderRadius: 100 }}
        source={userData?.photoURL ? { uri: userData.photoURL } : require('../../assets/images/avatar.png')}
      />
      </TouchableOpacity>


      <View className="flex">
        <Text className="mt-[50px] text-xl">Name: {userData?.name} </Text>
        <Text className="mt-[10px] text-xl">Email: {userData?.email} </Text>
      </View>

      <TouchableOpacity
        onPress={changePasswordHandler}
        className="py-2 px-4 mt-[50px] ml-[50px] mr-[50px] bg-gray-400 rounded-xl"
      >
        <Text className="text-xl font-bold text-center text-black">Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        className="py-2 px-4 mt-[50px] ml-[50px] mr-[50px] bg-gray-400 rounded-xl"
      >
        <Text className="text-xl font-bold text-center text-black">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProfileScreen;