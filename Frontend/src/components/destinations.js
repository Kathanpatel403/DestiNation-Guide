// components/Destinations.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { fetchData } from '../services/api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Destinations = () => {
  const [destinationData, setDestinationData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await fetchData('api/destinations/');

        // Limit the number of items to 10
        setDestinationData(data.destinations);
      } catch (error) {
        // Handle error, e.g., show an error message to the user
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

  const DestinationCard = ({ item }) => {
    const [isFavourite, toggleFavourite] = useState(false);

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
          onPress={() => toggleFavourite(!isFavourite)}
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