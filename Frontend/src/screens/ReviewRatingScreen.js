import React from 'react'
import { Text, View, TouchableOpacity, ImageBackground, SafeAreaView, Image, TextInput, ToastAndroid } from 'react-native'
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { useNavigation } from '@react-navigation/native';
import StarRating from 'react-native-star-rating';
import { auth, firestore } from "../../config/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { BASE_URL } from "../services/api"

const ReviewRatingScreen = ({ route }) => {
    const navigation = useNavigation();
    const [review, setreview] = useState("");
    const [rating, setRating] = useState(0);
    const { Place_id, Placename } = route.params;

    const onStarRatingPress = (rating) => {
        setRating(rating);
    };

    const handleReviewSubmit = async () => {
        try {
            const user = auth.currentUser;

            if (user) {
                const uid = user.uid;
                const userRoleRef = doc(firestore, "userRoles", uid);

                const userSnapshot = await getDoc(userRoleRef);
                const userData = userSnapshot.data();
                const userReviewRating = {
                    Place_id: Place_id,
                    Placename: Placename,
                    UserRatings: rating,
                    UserReview: review
                }
                if (userData) {
                    await updateDoc(userRoleRef, {
                        userReviewRatings: userReviewRating
                    });
                    console.log("Reviews added to firestore successfully!");
                    ToastAndroid.show("Reviews added to firestore successfully!", ToastAndroid.SHORT);
                } else {
                    console.log("failed to add reviews on firestore!")                   
                    ToastAndroid.show("failed to add reviews on firestore!", ToastAndroid.SHORT);
                }
            }
        } catch (error) {
            console.log("Something went wrong while adding reviews to firestore!")
            ToastAndroid.show("Something went wrong while adding reviews to firestore!", ToastAndroid.SHORT);
        }
    }

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

            <View className="flex-1 ">
                <View
                    style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
                    className="flex-1 px-8 pt-8"
                >
                    <View className="form space-y-2">
                        <Text className="text-gray-700 ml-4">Give Ratings</Text>
                        <StarRating
                            maxStars={5}
                            rating={rating}
                            selectedStar={(rating) => onStarRatingPress(rating)}
                            fullStarColor={'orange'}
                            emptyStarColor={'gray'}
                        />
                        <Text>{`Selected Rating: ${rating}`}</Text>
                        <Text className="text-gray-700 ml-4">Give Review</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
                            placeholder="Ratings"
                            value={review}
                            onChangeText={(value) => setreview(value)}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} className="flex items-end">
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="py-3 bg-gray-400 rounded-xl"
                            onPress={handleReviewSubmit}
                        >
                            <Text className="text-xl font-bold text-center text-black">
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </ImageBackground>
    )
}

export default ReviewRatingScreen;