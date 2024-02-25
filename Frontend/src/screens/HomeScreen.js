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
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
// import Categories from "../components/categories";
import { SortCategories, Destinations, Categories } from "../components/sortCategories";

import { useNavigation } from "@react-navigation/native";
import { auth, firestore } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useFocusEffect, DrawerActions } from "@react-navigation/native";


const ios = Platform.OS == "ios";
const topMargin = ios ? "mt-3" : "mt-10";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleProfileNavigation = () => {
    navigation.navigate("Profile");
  };
  const handleLogoNavigation = () => {
    navigation.navigate("Welcome"); // Replace 'Profile' with your ProfileScreen's navigation name
  };

  const [selectedSortCategory, setSelectedSortCategory] = useState('Popular');

  const handleSortCategorySelect = (sort) => {
    setSelectedSortCategory(sort);
  };

  const fetchUserData = async () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const userRoleRef = doc(firestore, "userRoles", uid);

      try {
        const docSnapshot = await getDoc(userRoleRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const photo = docSnapshot.data().photoURL;
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
        <View className="mx-5 flex-row justify-between items-center -mb-4">
          {/* <Text style={{fontSize: wp(7)}} className="font-bold text-neutral-700">DestiNation Guide</Text> */}
          <TouchableOpacity onPress={handleLogoNavigation}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={{
                height: wp(50),
                width: wp(30),
                marginLeft: -25,
                marginBottom: -15,
                marginTop: 20,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleProfileNavigation}
          >
            <Image
              source={userData?.photoURL ? { uri: userData.photoURL } : require('../../assets/images/avatar.png')}
              className="rounded-full"
              style={{
                height: wp(20),
                width: wp(20),
                marginLeft: -25,
                marginBottom: -15,
                marginTop: 15,
              }}
            />
          </TouchableOpacity>
        </View>
        
        <View className="mx-5">
          <TouchableOpacity onPress={() => { navigation.navigate("SearchPlace") }}>
            <View
              className="flex-row items-center bg-neutral-100 rounded-full p-4 space-x-2 pl-6 "
              style={{
                borderWidth: 1,
                borderColor: "#dbdbdb",
              }}
            >
              <MagnifyingGlassIcon size={20} strokeWidth={3} color="black" />
              <Text>Search Places</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className={"space-y-6 " + topMargin}
        >

          {/* categories */}
          <View className="mb-4">
            <Categories />
          </View>

          {/* sort categories */}
          <View>
            <View style={{ marginBottom: 20 }}>
              <SortCategories onSelectSortCategory={handleSortCategorySelect} />
            </View>

            {/* destinations */}
            <Destinations selectedSortCategory={selectedSortCategory} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}