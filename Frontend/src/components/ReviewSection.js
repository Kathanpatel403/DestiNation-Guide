import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import StarRating from 'react-native-star-rating'; // Import the Star Rating component

// ...

const ReviewSection = ({ item, theme }) => {
  const [userReview, setUserReview] = useState({
    user: "",
    comment: "",
    rating: 0,
  });

  const handleRatingChange = (rating) => {
    setUserReview((prevReview) => ({ ...prevReview, rating }));
  };

  const handleAddReview = () => {
    // Add your logic to handle the review submission (e.g., send to server, update state, etc.)
    console.log("User Review:", userReview);
    // Clear the input fields after submission
    setUserReview({
      user: "",
      comment: "",
      rating: 0,
    });
  };

  return (
    <Animatable.View
      animation="fadeInUpBig"
      delay={1000}
      style={{
        backgroundColor: "#D3d3d3",
        marginBottom: hp(3),
        borderRadius: wp(3),
        padding: wp(4),
        marginTop: hp(0.1),
      }}
    >
      <Text
        style={{
          fontSize: wp(5),
          fontWeight: "bold",
          color: theme.textLight,
        }}
      >
        Reviews and Ratings
      </Text>
      {item?.reviews?.map((review, index) => (
        <View key={index} style={{ marginBottom: hp(2), flexDirection: "row" }}>
          {/* Display Author's Profile Picture */}
          <Image
            source={require("../../assets/images/logo.png")} // Replace with the actual path to your profile picture
            style={{
              width: wp(8),
              height: wp(8),
              borderRadius: wp(4),
              marginRight: wp(2),
            }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: wp(4),
                color: theme.textLight,
                fontWeight: "bold",
                marginBottom: hp(1),
              }}
            >
              {review.user}
            </Text>
            <Text style={{ fontSize: wp(3.5), color: theme.textLight }}>
              {review.comment}
            </Text>
            {/* Display Ratings (Assuming rating is a number out of 5) */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: hp(1) }}>
              <FontAwesome name="star" size={wp(4)} color="#FFD700" style={{ marginRight: wp(1) }} />
              <Text style={{ fontSize: wp(4), color: theme.textLight }}>{review.rating}/5</Text>
            </View>
          </View>
        </View>
      ))}
      {/* User Review Input Section */}
      <View style={{ marginTop: hp(2) }}>
        <TextInput
          placeholder="Your Name"
          value={userReview.user}
          onChangeText={(text) => setUserReview((prevReview) => ({ ...prevReview, user: text }))}
          style={{
            fontSize: wp(4),
            borderBottomWidth: 1,
            borderColor: theme.textLight,
            marginBottom: hp(1),
            color: theme.textLight,
          }}
        />
        <TextInput
          placeholder="Your Comment"
          value={userReview.comment}
          onChangeText={(text) => setUserReview((prevReview) => ({ ...prevReview, comment: text }))}
          multiline
          numberOfLines={3}
          style={{
            fontSize: wp(4),
            borderBottomWidth: 1,
            borderColor: theme.textLight,
            marginBottom: hp(1),
            color: theme.textLight,
          }}
        />
        {/* Star Rating Component */}
        <StarRating
          disabled={false}
          maxStars={5}
          rating={userReview.rating}
          selectedStar={(rating) => handleRatingChange(rating)}
          fullStarColor="#FFD700"
          starSize={wp(5)}
        />
        {/* Add Review Button */}
        <TouchableOpacity
          onPress={handleAddReview}
          style={{
            backgroundColor: theme.bg(0.8),
            paddingVertical: hp(1),
            paddingHorizontal: wp(3),
            borderRadius: wp(5),
            marginTop: hp(2),
          }}
        >
          <Text style={{ fontSize: wp(4), fontWeight: "bold", color: "white" }}>Add Review</Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

export default ReviewSection;
