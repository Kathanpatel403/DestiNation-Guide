import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { theme } from "../theme";

import { ChevronLeftIcon } from "react-native-heroicons/solid";
const CategoryDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const categories = route.params?.categories || [];

  const [fadeIn] = useState(new Animated.Value(0));

  useEffect(() => {
    fadeInAnimation();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCategoryPress = (categoryId) => { 
    console.log(`Category ${categoryId} pressed`);
  };

  const fadeInAnimation = () => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 800,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/home3.jpg")}  
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              padding: wp(1),
              backgroundColor: theme.bgDark,
              borderRadius: wp(5),
            }}
          >
            <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>All Categories</Text>
          <View style={styles.headerPlaceholder} />
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
        
        {/* Categories */}
        <ScrollView contentContainerStyle={styles.categoryContainer}>
          {categories.map((cat, index) => (
            <Animated.View
              key={index}
              style={[styles.categoryCard, { opacity: fadeIn }]}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  handleCategoryPress(cat.id);
                  fadeInAnimation();
                }}
              >
                <Image source={cat.image} style={styles.categoryImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginTop: 30,
  },

  headerText: {
    fontSize: wp(5),
    fontWeight: "bold",
    color: "#000",
  },
  headerPlaceholder: {
    width: wp(4),
  },
  categoryContainer: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E1E1E1",
    backgroundColor: "#FFFFFF",
    elevation: 3,
  },
  categoryImage: {
    width: "100%",
    height: hp(25),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: "cover",
    marginBottom: hp(1),
  },
  cardContent: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  categoryTitle: {
    fontSize: wp(4),
    textAlign: "center",
    color: "#333333",
    fontWeight: "bold",
  },
});

export default CategoryDetails;