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

import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/solid";
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

  const handleCategoryPress = (category) => {
    // Your logic for handling category press
    console.log(`Category ${category} pressed`);
    navigation.navigate("CategoryPlace", {
      categories: category,
    })
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

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>All Categories</Text>
          <View style={styles.headerPlaceholder} />
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
                  handleCategoryPress(cat.title);
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
  },

  headerText: {
    fontSize: wp(5),
    fontWeight: "bold",
    color: "#000",
    marginLeft: 120
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