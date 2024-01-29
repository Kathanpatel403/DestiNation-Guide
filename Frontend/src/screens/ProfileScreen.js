import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../config/firebase";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth).then(() => console.log("Successfully logged out!"));
      navigation.navigate("LogIn");
    } catch (error) {
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
        <Text>User's Name: </Text>
        <Text>User's Email:</Text>
      </View>

      <TouchableOpacity 
        onPress={handleLogout}
        className="py-2 px-4 mb-[300px] ml-[50px] mr-[50px] bg-gray-400 rounded-xl"
      >
        <Text className="text-xl font-bold text-center text-black">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
