import React from "react";
import { View, Text, Image, TouchableOpacity, ToastAndroid } from "react-native";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth, firestore } from "../../config/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

  return (
    <View style="flex-1">
      <Image
        className="w-[170px] h-[170px] mt-[100px] ml-[90px]"
        source={require("../../assets/images/avatar.png")} // Replace with the source of your profile picture
      />

      <View>
        <Text>User's Name: {userData?.name} </Text>
        <Text>User's Email: {userData?.email} </Text>
      </View>

      <TouchableOpacity 
        onPress={handleLogout}
        className="py-2 px-4 mt-[400px] ml-[50px] mr-[50px] bg-gray-400 rounded-xl"
      >
        <Text className="text-xl font-bold text-center text-black">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
