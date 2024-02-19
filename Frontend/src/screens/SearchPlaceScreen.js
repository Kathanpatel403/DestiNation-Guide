import React from 'react';
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    ImageBackground,
    ToastAndroid
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/solid";
import { auth, firestore } from "../../config/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_URL } from "../services/api";

const SearchPlaceScreen = () => {
    const navigation = useNavigation();
    const [placename, setplacename] = useState("");
    const [searchedPlaces, setSearchedPlaces] = useState([]);
    const handleSearch = async () => {
        console.log(placename);
        try {
            const response = await fetch(`${BASE_URL}api/get_searched_places`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    SearchedPlace: placename,
                }),
            });

            if (!response.ok) {
                throw new Error('Error fetching searched places');
            }

            const data = await response.json();
            setSearchedPlaces(data.matching_places);
        } catch (error) {
            console.error('Error sending BookmarkedPlaces to backend:', error);
            ToastAndroid.show('Error sending BookmarkedPlaces to backend', ToastAndroid.SHORT);
        }
    }

    const DestinationCard = ({ item }) => {
        const [isFavourite, toggleFavourite] = useState(false);

        const placeid = item.Place_id;
        useEffect(() => {
            const fetchBookmarkStatus = async () => {
                try {
                    const user = auth.currentUser;

                    if (user) {
                        const uid = user.uid;
                        const userRoleRef = doc(firestore, "userRoles", uid);

                        const userSnapshot = await getDoc(userRoleRef);
                        const userData = userSnapshot.data();

                        if (userData && userData.BookmarkedPlaces && userData.BookmarkedPlaces.includes(placeid)) {
                            toggleFavourite(true);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchBookmarkStatus();
        }, []);

        const handleBookmark = async () => {
            console.log(placeid);
            try {
                const user = auth.currentUser;
                if (user) {
                    const uid = user.uid;
                    const userRoleRef = doc(firestore, "userRoles", uid);

                    const userSnapshot = await getDoc(userRoleRef);
                    const userData = userSnapshot.data();

                    if (userData && userData.BookmarkedPlaces && userData.BookmarkedPlaces.includes(placeid)) {

                        await updateDoc(userRoleRef, { BookmarkedPlaces: arrayRemove(placeid) });
                        console.log("Bookmark removed from firestore successfully!");
                        ToastAndroid.show("Bookmark removed successfully!", ToastAndroid.SHORT);
                        toggleFavourite(false);
                    } else {
                        await updateDoc(userRoleRef, { BookmarkedPlaces: arrayUnion(placeid) });
                        console.log("bookmark added to firestore successfully!");
                        ToastAndroid.show("Bookmark added successfully!", ToastAndroid.SHORT);
                        toggleFavourite(!isFavourite);
                    }
                } else {
                    ToastAndroid.show("User data not found.", ToastAndroid.SHORT);
                }
            } catch (error) {
                ToastAndroid.show(`Error fetching user data: ${error}`, ToastAndroid.SHORT);
                console.error("Error fetching user data:", error);
            }
        }

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Destination', { ...item })}
                style={{ width: wp(44), height: wp(65) }}
                className="flex justify-end relative p-4 py-6 space-y-2 mb-5"
            >
                <Image
                    source={{ uri: item.Image[0] }}
                    style={{ width: wp(44), height: wp(65), borderRadius: 35 }}
                    className="absolute"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={{
                        width: wp(44),
                        height: hp(15),
                        borderBottomLeftRadius: 35,
                        borderBottomRightRadius: 35,
                    }}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    className="absolute bottom-0"
                />

                <TouchableOpacity
                    onPress={handleBookmark}
                    style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
                    className="absolute top-1 right-3 rounded-full p-3"
                >
                    <HeartIcon size={wp(5)} color={isFavourite ? 'red' : 'white'} />
                </TouchableOpacity>

                <Text style={{ fontSize: wp(4) }} className="text-white font-semibold">
                    {item.Name}
                </Text>
                <Text style={{ fontSize: wp(2.2) }} className="text-white">
                    {item.ShortDescription}
                </Text>
            </TouchableOpacity>
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
            <View className="mx-5 mb-4 mt-[10px]">
                <View
                    className="flex-row items-center bg-neutral-100 rounded-full space-x-2 pl-6 mt-[10px]"
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
                        value={placename}
                        onChangeText={(value) => setplacename(value)}
                    />
                    <TouchableOpacity
                        onPress={handleSearch}
                    >
                        <Image
                            source={require('../../assets/images/go.png')}
                            style={{ width: 50, height: 50, marginRight: 13, borderRadius: 50 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView>
                <View className="font-bold items-center">
                    <View className="mx-4 flex-row mt-[10px] justify-between flex-wrap">
                        {searchedPlaces.map((item, index) => (
                            <DestinationCard key={index} item={item} />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

export default SearchPlaceScreen;