import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, FlatList, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/solid";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { BASE_URL } from "../services/api";

const AllReviewRating = ({ route }) => {
    const navigation = useNavigation();
    const [placename, setplacename] = useState("");
    const [searchedPlaces, setSearchedPlaces] = useState([]);
    const { PlaceName } = route.params;

    const handleSearch = async () => {
        try {
            const response = await fetch(`${BASE_URL}api/get_searched_places`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    SearchedPlace: PlaceName,
                }),
            });

            if (!response.ok) {
                throw new Error('Error fetching searched places');
            }

            const data = await response.json();
            setSearchedPlaces(data.matching_places);
            console.log("Data recieved for allreviewrating screen: ", searchedPlaces)
        } catch (error) {
            console.error('Error sending BookmarkedPlaces to backend:', error);
            ToastAndroid.show('Error sending BookmarkedPlaces to backend', ToastAndroid.SHORT);
        }
    }
    // const userReviewRatings = searchedPlaces.userReviewRating;

    // // Map over the userReviewRating array to render each user's review
    // const userReviews = userReviewRatings.map((review, index) => (
    //     <View key={index}>
    //         <Text>User: {review.userName}</Text>
    //         <Text>Email: {review.userEmail}</Text>
    //         <Text>Rating: {review.userRating}</Text>
    //         <Text>Review: {review.userReview}</Text>
    //     </View>
    // ));

    useEffect(() => {
        handleSearch();
    }, []);

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

            <View className="flex-1">
                <View className="items-center mt-5">
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
                </View>

                <View className="items-center mt-1">
                    <Text
                        style={{
                            fontSize: wp(6),
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: hp(2),
                        }}
                    >
                        {PlaceName}
                    </Text>
                </View>

                <View>
                    <View
                        style={{
                            backgroundColor: "#e3e3e3", // Adjust background color as needed
                            borderRadius: wp(5), // Slightly increased border radius
                            padding: wp(4),
                            marginBottom: hp(2),
                            shadowColor: '#fff',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8, // For Android shadow
                            borderWidth: 1, // Border width
                            borderColor: "#ccc",
                            marginLeft: wp(3),
                            marginRight: wp(3)
                        }}
                    >
                        <Text style={{ fontSize: wp(5), fontWeight: "bold", marginBottom: hp(1) }}>
                            User: User1
                        </Text>
                        <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>
                            Email: user1@gmail.com
                        </Text>
                        <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>
                            Rating: 4
                        </Text>
                        <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>
                            Review: Had alot of fun.. Overall great experience.
                        </Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: "#e3e3e3", // Adjust background color as needed
                            borderRadius: wp(5), // Slightly increased border radius
                            padding: wp(4),
                            marginBottom: hp(3),
                            shadowColor: '#fff',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8, // For Android shadow
                            borderWidth: 1, // Border width
                            borderColor: "#ccc",
                            marginLeft: wp(3),
                            marginRight: wp(3)
                            // Border color
                        }}
                    >
                        <Text style={{ fontSize: wp(5), fontWeight: "bold", marginBottom: hp(1) }}>
                            User: User2
                        </Text>
                        <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>
                            Email: user2@gmail.com
                        </Text>
                        <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>
                            Rating: 3
                        </Text>
                        <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>
                            Review: Great place. But could be more accessible.
                        </Text>
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
}

export default AllReviewRating;