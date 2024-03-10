import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, View, TouchableOpacity } from "react-native"; // Import TouchableOpacity
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
const FloatingLogo = ({ navigation }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 0.5,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    floatAnimation.start();

    return () => {
      floatAnimation.stop();
    };
  }, [animatedValue]);

  const rotateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.7, 1],
  });

  const goToNextPage = () => {
    navigation.navigate("NextPage");
  };

  const increaseSizeAndFade = Animated.sequence([
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 2,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]),
    Animated.timing(scale, {
      toValue: 1,
      duration: 1, // Reset duration to 1 for immediate effect
      easing: Easing.ease,
      useNativeDriver: true,
    }),
  ]);

  const onPress = () => {
    increaseSizeAndFade.start(() => {
      // Navigate to the next page after the animation completes
      goToNextPage();
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0)", // Transparent background
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <Animated.View
          style={{
            transform: [
              { perspective: 1000 }, // Add perspective for 3D effect
              { rotateY },
              { scale },
            ],
            opacity,
          }}
        >
          <Image
            source={require("../../assets/images/ho.png")}
            style={{ width: wp(50), height: wp(50) }}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingLogo;
