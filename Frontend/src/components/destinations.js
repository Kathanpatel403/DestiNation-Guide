// components/Destinations.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { fetchData } from '../services/api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { auth, firestore, storage } from "../../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const Destinations = () => {
  const [destinationData, setDestinationData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await fetchData('api/destinations/');
        // console.log(data);
        setDestinationData(data.destinations);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

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

export default Destinations;