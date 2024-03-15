import React from "react";
import { View, Text, Image, TouchableOpacity, ToastAndroid, FlatList, ImageBackground, Animated, Easing, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth, firestore, storage } from "../../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection } from "firebase/firestore";

import { ChevronLeftIcon } from "react-native-heroicons/solid";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from "react-native-animatable";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [locationPreferences, setLocationPreferences] = useState([]);
  const [categoryPreferences, setCategoryPreferences] = useState([]);

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
          setLocationPreferences(data.LocationPreference || []);
          setCategoryPreferences(data.CategoryPreference || []);
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
    <ImageBackground
      source={require("../../assets/images/home3.jpg")} // Change the path to your image
      style={{ flex: 1 }}
    >

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          padding: wp(4),
          marginLeft: wp(2),
          backgroundColor: "white",
          borderRadius: wp(5),
          marginRight: wp(82),
          marginTop: wp(10),
        }}
      >
        <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="black" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}d
        style={{marginLeft: 5, marginRight: 10 }}
      >
      <View className="flex-row justify-center items-center">
        <TouchableOpacity onPress={handleImagePress}>
          <Image
            // style={{ width: 120, height: 120, marginTop: 20, marginLeft: 100, marginBottom: 20, borderRadius: 100 }}
            style={{
              padding: wp(4),
              backgroundColor: "white",
              marginTop: hp(1),
              marginBottom: hp(3),
              width: wp(30),
              height: wp(30),
              borderRadius: wp(100)
            }}
            className=""
            source={userData?.photoURL ? { uri: userData.photoURL } : require('../../assets/images/avatar.png')}
          />
        </TouchableOpacity>
      </View>
      
        <View className="flex rounded-sm shadow-md">
          <Animatable.View
            animation="fadeInUpBig"
            delay={200}
            style={{
              backgroundColor: "#e3e3e3", // Lighter background color
              borderRadius: wp(2),
              padding: wp(2),
              marginBottom: hp(1),
              marginLeft: wp(2),
              marginRight: wp(2),
              marginTop: wp(3),
              alignItems: "flex-start", // Align text to the left
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 1,
              borderColor: "#ccc", // Light border color
            }}
          >
            <Text
              style={{
                fontSize: wp(4),
                fontWeight: "bold",
                color: "#333", // Darker text color
                marginBottom: hp(1),
              }}
            >
              Name: {userData?.name}
            </Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUpBig"
            delay={200}
            style={{
              backgroundColor: "#e3e3e3", // Lighter background color
              borderRadius: wp(2),
              padding: wp(2),
              marginBottom: hp(1),
              marginLeft: wp(2),
              marginRight: wp(2),
              alignItems: "flex-start", // Align text to the left
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 1,
              borderColor: "#ccc", // Light border color
            }}
          >
            <Text
              style={{
                fontSize: wp(4),
                fontWeight: "bold",
                color: "#333", // Darker text color
                marginBottom: hp(1),
              }}
            >
              Email: {userData?.email}
            </Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUpBig"
            delay={200}
            style={{
              backgroundColor: "#e3e3e3", // Lighter background color
              borderRadius: wp(2),
              padding: wp(2),
              marginBottom: hp(1),
              marginLeft: wp(2),
              marginRight: wp(2),
              alignItems: "flex-start", // Align text to the left
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 1,
              borderColor: "#ccc", // Light border color
            }}
          >
            <Text
              style={{
                fontSize: wp(4),
                fontWeight: "bold",
                color: "#333", // Darker text color
                marginBottom: hp(1),
              }}
            >
              Location Preferences:
            </Text>
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <FlatList
                data={locationPreferences}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text>{item}</Text>}
              />
            </View>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUpBig"
            delay={200}
            style={{
              backgroundColor: "#e3e3e3", // Lighter background color
              borderRadius: wp(2),
              padding: wp(2),
              marginBottom: hp(1),
              marginLeft: wp(2),
              marginRight: wp(2),
              alignItems: "flex-start", // Align text to the left
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 1,
              borderColor: "#ccc", // Light border color
            }}
          >
            <Text
              style={{
                fontSize: wp(4),
                fontWeight: "bold",
                color: "#333", // Darker text color
                marginBottom: hp(1),
              }}
            >
              Category Preferences:
            </Text>
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <FlatList
                data={categoryPreferences}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text>{item}</Text>}
              />
            </View>
          </Animatable.View>
        </View>
        <View className="flex-row justify-center items-center">
          <Animatable.View
            animation="fadeInUpBig"
            delay={200}
            style={{
              marginBottom: hp(2),
              marginLeft: wp(5),
              marginRight: wp(5),
              alignItems: "flex-start", // Align text to the left
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => { navigation.navigate("UpdateInfo") }}
              className="py-2 px-4 bg-gray-400 ml-[40px] mt-3 rounded-xl"
            >
              <Text className="text-xl font-bold pl-[10px] mr-[0px] text-black">Update Information</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={changePasswordHandler}
              className=" px-4 bg-gray-400 py-2 mt-3 rounded-xl ml-[40px] mr-[50px]"
            >
              <Text className="text-xl font-bold text-center pl-[5px] mr-[15px] text-black">Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { navigation.navigate("Bookmarks") }}
              className="py-2 px-4 mt-3 bg-gray-400 ml-[40px] mr-[0px] rounded-xl"
            >
              <Text className="text-xl font-bold pl-[18px] mr-[16px] text-black">Your BookMarks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { navigation.navigate("UserReviewRating") }}
              className="py-2 px-4 mt-3 bg-gray-400 ml-[40px] mr-[0px] rounded-xl"
            >
              <Text className="text-xl font-bold pl-[18px] mr-[16px] text-black">User all reviews</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="py-2 px-4 mt-3 bg-gray-400 ml-[40px]  rounded-xl items-center"
            >
              <Text className="text-xl font-bold pl-[60px] mr-[58px] text-black">Logout</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView >
    </ImageBackground>
  );
}

export default ProfileScreen;