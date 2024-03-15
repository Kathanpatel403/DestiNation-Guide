import { View, Text, ToastAndroid, ImageBackground, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, firestore, storage } from "../../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, arrayUnion, arrayRemove } from "firebase/firestore";
import { signOut, sendPasswordResetEmail } from "firebase/auth"; import { ChevronLeftIcon } from "react-native-heroicons/solid";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import StarRating from "react-native-star-rating";
import { useNavigation } from '@react-navigation/native';


const UserAllReviewRating = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState([]);

    const fetchUserData = async () => {
        const user = auth.currentUser;

        if (user) {
            const uid = user.uid;
            const userRef = doc(firestore, "userRoles", uid);

            try {
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();

                    if (userData.ReviewRating) {
                        const reviewsData = Object.entries(userData.ReviewRating).map(([placeName, reviewInfo]) => ({
                            placeName: placeName,
                            rating: reviewInfo.Rating,
                            review: reviewInfo.Review
                        }));

                        const userDataWithReviews = {
                            ...userData,
                            reviews: reviewsData
                        };

                        setUserData(userDataWithReviews);

                        ToastAndroid.show(`User data fetched successfully!`, ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show(`User data does not contain reviews`, ToastAndroid.SHORT);
                    }
                } else {
                    ToastAndroid.show(`User data not found!`, ToastAndroid.SHORT);
                }
            } catch (error) {
                ToastAndroid.show(`Error fetching user data: ${error}`, ToastAndroid.SHORT);
                console.error("Error fetching user data:", error);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const generateStars = (rating) => {
        return (
            <StarRating
                disabled={true}
                maxStars={5}
                rating={rating}
                starSize={25}
                fullStarColor="gold"
                emptyStarColor="gray"
            />
        );
    };

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

                <ScrollView>
                    <View style={{
                        backgroundColor: "white",
                        borderRadius: wp(5),
                        padding: wp(4),
                        marginBottom: hp(3),
                        shadowColor: '#fff',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        marginLeft: wp(3),
                        marginRight: wp(3),
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {userData ? (
                            <View>
                                <Text className="text-xl ">User Name: {userData.name}</Text>
                                <Text className="text-xl mb-[10px]">Email: {userData.email}</Text>

                                {userData.reviews && (
                                    <View>
                                        <Text className="text-lg">Reviews:</Text>
                                        {userData.reviews.map((review, index) => (
                                            <View key={index} style={{
                                                backgroundColor: "#e3e3e3",
                                                borderRadius: wp(5),
                                                padding: wp(4),
                                                marginBottom: hp(3),
                                                shadowColor: '#fff',
                                                shadowOffset: { width: 0, height: 5 },
                                                shadowOpacity: 0.3,
                                                shadowRadius: 8,
                                                elevation: 8,
                                                borderWidth: 1,
                                                borderColor: "#ccc",
                                                marginLeft: wp(3),
                                                marginRight: wp(3)
                                            }}>
                                                <Text className="text-[15px]">Place Name: {review.placeName}</Text>
                                                <Text className="text-[15px]">Review: {review.review}</Text>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text className="text-[15px]" style={{marginBottom: hp(1)}}>Rating:  {review.rating}</Text>
                                                    <Text className="text-[15px]"> {generateStars(review.rating)}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ) : (
                            <Text>Loading user data...</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    )
}

export default UserAllReviewRating;