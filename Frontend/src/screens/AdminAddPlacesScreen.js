import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { theme } from '../theme';

const AdminAddPlacesScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");
    const [activity, setActivity] = useState("");
    const [amenities, setAmenities] = useState("");


    const handleAddPlace = () => {
        console.log("Place added to database successfully!");
    };

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
                    marginRight: wp(82),
                    backgroundColor: 'white',
                    borderRadius: wp(5),
                    marginTop: wp(10)
                }}
            >
                <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="black" />
            </TouchableOpacity>

            <SafeAreaView className="flex-1 ">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className={"space-y-6 "}
                >
                    <View className='flex-1'>
                        <View
                            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
                            className="flex-1 px-8 pt-8"
                        >
                            <Text className='text-2xl font-bold mb-8 ml-[10px]'>Admin Add Place Screen</Text>

                            {/* Form Fields */}
                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                placeholder="Name"
                                value={name}
                                onChangeText={(text) => setName(text)}
                            />

                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                placeholder="Category"
                                value={category}
                                onChangeText={(text) => setCategory(text)}
                            />

                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                placeholder="City"
                                value={city}
                                onChangeText={(text) => setCity(text)}
                            />

                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                placeholder="State"
                                value={state}
                                onChangeText={(text) => setState(text)}
                            />

                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                placeholder="Country"
                                value={country}
                                onChangeText={(text) => setCountry(text)}
                            />

                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                placeholder="Latitude"
                                value={latitude}
                                onChangeText={(text) => setLatitude(text)}
                            />

                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                placeholder="Longitude"
                                value={longitude}
                                onChangeText={(text) => setLongitude(text)}
                            />

                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                placeholder="Description"
                                value={description}
                                onChangeText={(text) => setDescription(text)}
                            />

                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                placeholder="Activities"
                                value={activity}
                                onChangeText={(text) => setActivity(text)}
                            />

                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                placeholder="Amenities"
                                value={amenities}
                                onChangeText={(text) => setAmenities(text)}
                            />

                            {/* Add Place Button */}
                            <TouchableOpacity
                                onPress={handleAddPlace}
                                className="py-3 bg-gray-400 rounded-xl mb-[10px]"
                            >
                                <Text className="text-xl font-bold text-center text-black">
                                    Add Place
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default AdminAddPlacesScreen;