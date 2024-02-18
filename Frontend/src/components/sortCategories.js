// SortCategories.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image ,ScrollView,ToastAndroid} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { fetchData } from '../services/api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { theme } from "../theme";
import { categoriesData } from "../constants";
import { auth, firestore, storage } from "../../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
const Categories = () => {
  const navigation = useNavigation();
  const [places, setPlaces] = useState([]);
  const handleSeeAll = () => {
    // Navigate to the category details page
    navigation.navigate("CategoryDetails", { categories: categoriesData });
  };
  const fetchPlacesByCategory = async (category) => {
    try {
      const response = await fetch(`http://192.168.1.6:8000/api/places/category/${category}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPlaces(data.places);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  useEffect(() => {
    // Example: Fetch places for the first category on component mount
    if (categoriesData.length > 0) {
      fetchPlacesByCategory(categoriesData[0].title);
    }
  }, []);

  const handleCategoryPress = (category) => {
    // Fetch places data based on the selected category
    fetchPlacesByCategory(category);
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
            onPress={() => handleCategoryPress(cat.title)}
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




export default function SortCategories({ onSelectSortCategory }) {
  const [activeSort, setActiveSort] = useState('Popular');

  const handleSortSelection = (sort) => {
    setActiveSort(sort);
    onSelectSortCategory(sort); // Pass selected sort category to parent component
  };

  const sortCategoryData = ['All', 'Popular', 'Recommendation']; // Update available sort categories

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: wp(4),
        backgroundColor: '#f0f0f0',
        borderRadius: wp(5),
        borderWidth: 1,
        borderColor: '#dbdbdb',
        paddingVertical: wp(2),
        paddingHorizontal: wp(4),
        spaceBetween: wp(2),
      }}
    >
      {sortCategoryData.map((sort, index) => {
        let isActive = sort === activeSort;
        let activeButtonStyle = isActive
          ? { backgroundColor: '#d1d5db', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8 }
          : {};

        return (
          <TouchableOpacity
            onPress={() => handleSortSelection(sort)} // Updated onPress handler
            key={index}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: wp(3.5),
              borderRadius: wp(5),
              ...activeButtonStyle,
            }}
          >
            <Text
              style={{
                fontSize: wp(4),
                fontWeight: '600',
                color: isActive ? '#000000' : '#000000',
              }}
            >
              {sort}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Destinations = ({ selectedSortCategory }) => {
  const [destinationData, setDestinationData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        let data;
        if (selectedSortCategory === 'Recommendation') {
          // Fetch recommendations based on the selected sort category
          const response = await fetchData(`api/recommendations/Inorbit Mall`);
          
          if (response && response.recommendations) {
            // Now, fetch details of each recommendation from the backend
            const recommendedPlaces = response.recommendations;
            data = recommendedPlaces;
          } else {
            throw new Error('Invalid response format for recommendations');
          }
        } else if (selectedSortCategory === 'Popular') {
          // Fetch destinations sorted by likes
          const response = await fetchData('api/destinations/sorted-by-likes');
          if (response && response.destinations) {
            data = response.destinations;
          } else {
            throw new Error('Invalid response format for destinations');
          }
        } else {
          // Fetch destinations based on other sort categories
          const response = await fetchData('api/destinations/');
          if (response && response.destinations) {
            data = response.destinations;
          } else {
            throw new Error('Invalid response format for destinations');
          }
        }
        // Limit the number of items to 10
        setDestinationData(data.slice(0, 10));
      } catch (error) {
        // Handle error, e.g., show an error message to the user
        console.error('Error fetching destinations:', error);
      }
    };
  
    fetchDestinations();
  }, [selectedSortCategory]);
  

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
            // console.log("Bookmark removed from firestore successfully!");
            ToastAndroid.show("Bookmark removed successfully!", ToastAndroid.SHORT);
            toggleFavourite(false);
          } else {
            await updateDoc(userRoleRef, { BookmarkedPlaces: arrayUnion(placeid) });
            // console.log("bookmark added to firestore successfully!");
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
          source={{ uri: item.Image[0] }} // Assuming the first image URL is used
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
    <View className="mx-4 flex-row justify-between flex-wrap">
      {destinationData.map((item, index) => (
        <DestinationCard key={index} item={item} />
      ))}
    </View>
  );
};

export { Categories,SortCategories, Destinations };
