import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../theme";
import { categoriesData } from "../constants";

const Categories = () => {
  const navigation = useNavigation();

  const handleSeeAll = () => {
    // Navigate to the category details page
    navigation.navigate("CategoryDetails", { categories: categoriesData });
  };

  return (
    <View style={{ paddingBottom: hp(2) }}>
      <View
        style={{
          marginHorizontal: wp(5),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: wp(4), fontWeight: "bold", color: theme.text }}
        >
          Categories
        </Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={{ fontSize: wp(4), color: theme.text }}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: wp(5) }}
        style={{ marginTop: hp(1) }}
        showsHorizontalScrollIndicator={false}
      >
        {categoriesData.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={{ alignItems: "center", marginRight: wp(4) }}
          >
            <Image
              source={cat.image}
              style={{ width: wp(20), height: wp(19), borderRadius: wp(3) }}
            />
            <Text
              style={{ color: theme.text, fontSize: wp(3), marginTop: hp(1) }}
            >
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;
