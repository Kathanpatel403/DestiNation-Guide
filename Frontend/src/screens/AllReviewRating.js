import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ImageBackground, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/solid";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";

const AllReviewRating = ({ route }) => {
    const navigation = useNavigation();
    const { userReviewRatingData } = route.params;

    const showdetails = () => {
        console.log("type of data: ", typeof (userReviewRatingData))
        console.log("Data recieved on AllReviewRating screen: ", userReviewRatingData)
    }

    useEffect(() => {
        showdetails();
    }, []);

    // const reviewsData = userReviewRatingData.map((str) => {
    //     try {
    //         // Use JSON.parse if the string follows a JSON format
    //         return JSON.parse(str);
    //     } catch (error) {
    //         // Fallback to eval if JSON.parse fails (use with caution)
    //         return eval(`(${str})`);
    //     }
    // });

    return (
        <ImageBackground
            source={require("../../assets/images/home3.jpg")}
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

            <Text
                style={{
                    fontSize: wp(6),
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: hp(2),
                }}
            >
                User Reviews and Ratings
            </Text>

            <Text>{userReviewRatingData}</Text>

            <View>
                {Object.keys(userReviewRatingData).map((userName, index) => (
                    <View
                        key={index}
                        style={{
                            marginBottom: hp(2),
                        }}
                    >
                        <Text style={{ fontSize: wp(5), fontWeight: "bold", marginBottom: hp(1) }}>
                            User: {userName}
                        </Text>
                        <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>
                            Email: {userReviewRatingData[userName].userEmail}
                        </Text>
                        <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>
                            Rating: {userReviewRatingData[userName].userRating}
                        </Text>
                        <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>
                            Review: {userReviewRatingData[userName].userReview}
                        </Text>
                    </View>
                ))}
            </View>
        </ImageBackground>
    )
}

export default AllReviewRating;