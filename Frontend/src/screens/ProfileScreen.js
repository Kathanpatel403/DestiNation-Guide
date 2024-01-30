import React from "react";
import { View, Text, Image, TouchableOpacity, ToastAndroid } from "react-native";
import { useState, useEffect } from "react";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth, firestore } from "../../config/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import { ChevronLeftIcon } from "react-native-heroicons/solid";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { theme } from "../theme";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
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
          const email = docSnapshot.data().email;
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
      <Image
        className="w-[120px] h-[120px] mt-[40px] ml-[100px] rounded-[100px]"
        source={require("../../assets/images/avatar.png")}
      />

      <View className="flex">
        <Text className="mt-[50px] text-xl">Name: {userData?.name} </Text>
        <Text className="mt-[10px] text-xl">Email: {userData?.email} </Text>
      </View>

      <TouchableOpacity
        onPress={changePasswordHandler}
        className="py-2 px-4 mt-[150px] ml-[50px] mr-[50px] bg-gray-400 rounded-xl"
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
};

export default ProfileScreen;
