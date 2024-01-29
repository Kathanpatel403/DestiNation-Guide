import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  TextInput,
  ImageBackground,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import Categories from "../components/categories";
import SortCategories from "../components/sortCategories";
import Destinations from "../components/destinations";
import { useNavigation } from "@react-navigation/native";

const ios = Platform.OS == "ios";
const topMargin = ios ? "mt-3" : "mt-10";

export default function HomeScreen() {
  const navigation = useNavigation();
  const handleProfileNavigation = () => {
    navigation.navigate("Profile"); // Replace 'Profile' with your ProfileScreen's navigation name
  };
  const handleLogoNavigation = () => {
    navigation.navigate("Welcome"); // Replace 'Profile' with your ProfileScreen's navigation name
  };

  return (
    <ImageBackground
      source={require("../../assets/images/home3.jpg")} // Change the path to your image
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 ">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        {/* avatar */}
        <View className="mx-5 flex-row justify-between items-center  -mb-4">
          {/* <Text style={{fontSize: wp(7)}} className="font-bold text-neutral-700">DestiNation Guide</Text> */}
          <TouchableOpacity onPress={handleLogoNavigation}>
              <Image
            source={require("../../assets/images/logo.png")}
            style={{
              height: wp(50),
              width: wp(30),
              marginLeft: -25,
              marginBottom: -10,
            }}
          />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfileNavigation}>
            <Image
              source={require("../../assets/images/avatar.png")}
              style={{ height: wp(18), width: wp(15) }}
            />
          </TouchableOpacity>
        </View>
        <View className="mx-5 mb-4 ">
          <View
            className="flex-row items-center bg-neutral-100 rounded-full p-4 space-x-2 pl-6 "
            style={{
              borderWidth: 1,
              borderColor: "#dbdbdb",
            }}
          >
            <MagnifyingGlassIcon size={20} strokeWidth={3} color="black" />
            <TextInput
              placeholder="Search destination"
              placeholderTextColor={"black"}
              className="flex-1 text-base mb-1 pl-1 tracking-wider "
            />
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className={"space-y-6 " + topMargin}
        >
          {/* search bar */}

          {/* categories */}
          <View className="mb-4">
            <Categories />
          </View>

          {/* sort categories */}
          <View className="mb-4 ">
            <SortCategories />
          </View>

          {/* destinations */}
          <View>
            <Destinations />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
