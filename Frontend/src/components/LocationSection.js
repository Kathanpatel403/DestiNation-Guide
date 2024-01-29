import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LocationSection = () => {
  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={{ flex: 1 }}
    >
      <View>
        <Text style={{ color: "white" }}>Location Section</Text>
        {/* Other JSX for your component */}
      </View>
    </LinearGradient>
  );
};

export default LocationSection;
