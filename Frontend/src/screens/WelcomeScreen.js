import React, { useEffect, useState } from "react";
import { View, Text, Image, ImageBackground, ToastAndroid } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import FloatingLogo from "../components/floatingLogo"; // Assuming you have a FloatingLogo component
import TypingEffect from "../components/TypingEffect"; // Assuming the correct path
import useAuth from "../../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../config/firebase";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const user = useAuth();
  const [userRole, setUserRole] = useState(null);
	const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (user) {
  //       navigation.navigate("Home");
  //     } else {
  //       navigation.navigate("LogIn");
  //     }
  //   }, 1500);

  //   return () => clearTimeout(timeout);
  // }, [navigation]);

  // Use useFocusEffect to navigate to Home after 3 seconds when the screen comes into focus
  useFocusEffect(()=> {
    const timeout = setTimeout(() => {
      fetchUserRole();
    }, 1500);

    return () => clearTimeout(timeout);
  });
  const fetchUserRole = async () => {
		const user = getAuth().currentUser;
		if (user) {
			const uid = user.uid;
			const userRoleRef = doc(firestore, "userRoles", uid);

			try {
				const docSnapshot = await getDoc(userRoleRef);

				if (docSnapshot.exists()) {
					const role = docSnapshot.data().role;
					setUserRole(role);
					const data = docSnapshot.data().name;
					setUserData(data);

					if (role === "Admin") {
						ToastAndroid.show(`Logging in as: ${data}`, ToastAndroid.SHORT);
						console.log("logging in");
						navigation.navigate("AdminMain");
					} else if (role === "user") {
						ToastAndroid.show(`Logging in as: ${data}`, ToastAndroid.SHORT);
						console.log("logging in");
						navigation.navigate("Home");
					}
				} else {
					console.log("User doesn't exist. Please SignUp!");
					setUserRole(null);
				}
			} catch (error) {
				console.error("Error fetching user role:", error);
			}
		}
	};
  const onFinishTyping = () => {
    // Logic to handle typing effect completion
  };

  return (
    <ImageBackground
      source={require("../../assets/images/home3.jpg")} // Change the path to your image
      style={{ flex: 1 }}
    >
      <View className="flex-1 flex justify-end">
        {/* content & gradient */}
        <View className="p-5 pb-10 space-y-8">
          <LinearGradient
            colors={["transparent", "rgba(156, 230, 255,0.6)"]}
            style={{ width: wp(100), height: hp(50) }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="absolute bottom-0"
          />
          <View className="space-y-3">
            <Text className="items-center justify-center mt-[200px] ml-[80px]">
              <FloatingLogo />
            </Text>
            <TypingEffect
              className="w-4 mb-[250px]"
              text="DestiNation Guide"
              onFinishTyping={onFinishTyping}
              style={{ fontSize: 24 }}
            />
            <Text
              className="text-black font-medium mb-[250px] text-[15px]"
              style={{ fontSize: wp(5) }}
            >
              Unlocking Destinations, One Click Away
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;