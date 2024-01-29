import React, { useEffect } from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import FloatingLogo from "../components/floatingLogo"; // Assuming you have a FloatingLogo component
import TypingEffect from "../components/TypingEffect"; // Assuming the correct path
import useAuth from "../../hooks/useAuth";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const user = useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        navigation.navigate("Home");
      } else {
        navigation.navigate("LogIn");
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [navigation]);

  // Use useFocusEffect to navigate to Home after 3 seconds when the screen comes into focus
  useFocusEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        navigation.navigate("Home");
      } else {
        navigation.navigate("LogIn");
      }
    }, 1500);

    return () => clearTimeout(timeout);
  });

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
