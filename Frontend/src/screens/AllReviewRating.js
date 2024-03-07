import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { firestore } from "../../config/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import StarRating from "react-native-star-rating";

const AllReviewRating = ({ route }) => {
    const navigation = useNavigation();
    const { PlaceName } = route.params;
    const [reviewsData, setReviewsData] = useState([]);

    useEffect(() => {
        const fetchReviewPlace = async () => {
            console.log("AllReviewRating screen refreshed!")
            try {
                const userRolesCollection = collection(firestore, 'userRoles');
                const queryForPlace = query(userRolesCollection, where(`ReviewRating.${PlaceName}`, '!=', null));
                const querySnapshot = await getDocs(queryForPlace);

                if (!querySnapshot.empty) {
                    const data = [];
                    querySnapshot.forEach((doc) => {
                        const userData = doc.data();
                        const { name, email } = userData;
                        const reviewData = {
                            name,
                            email,
                            review: userData.ReviewRating[PlaceName].Review,
                            rating: userData.ReviewRating[PlaceName].Rating,
                        };
                        data.push(reviewData);
                    });

                    setReviewsData(data);
                } else {
                    setReviewsData([]);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        }
        fetchReviewPlace();
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

                <ScrollView>
                    <View>
                        {reviewsData.map((review, index) => (
                            <View key={index}
                                style={{
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
                                <Text style={{ fontSize: wp(5), fontWeight: "bold", marginBottom: hp(1) }}>Name: {review.name}</Text>
                                <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>Email: {review.email}</Text>
                                <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>Review: {review.review}</Text>
                                <View style={{flexDirection: "row"}}>
                                <Text style={{ fontSize: wp(4.5), marginBottom: hp(1) }}>Rating: ({review.rating})</Text>
                                <Text style={{ fontSize: wp(4.5)}}>  {generateStars(review.rating)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    )
}

export default AllReviewRating;