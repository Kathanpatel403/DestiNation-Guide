import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from "react-native-responsive-screen";

const AdminHomeScreen = () => {

    const navigation = useNavigation();

    const handleAddPlaces = () => {
        // Navigate to the Add Places screen or implement your logic
        navigation.navigate("AdminAddPlace");
    };

    const handleAdminAddUser = () => {
        // Navigate to the Manage Users screen or implement your logic
        navigation.navigate("AdminAdd")
    };

    const handleDashboard = () => {
        // Navigate to the Dashboard screen or implement your logic
        navigation.navigate("AdminDashboard")
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
                    marginTop: wp(12)
                }}
            >
                <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="black" />
            </TouchableOpacity>

            <Text className='text-2xl font-bold mt-[100px] ml-[55px]'>Admin Home Screen</Text>
            <View className='flex-1 justify-center items-center'>
                <TouchableOpacity
                    onPress={handleAddPlaces}
                    className='bg-gray-400 p-4 rounded-md mb-4'>
                    <Text className='text-black font-bold'>Add Places</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {navigation.navigate("AdminUpdatePlace")}}
                    className='bg-gray-400 p-4 rounded-md mb-4'>
                    <Text className='text-black font-bold'>Update Places</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {navigation.navigate("AdminRemovePlace")}}
                    className='bg-gray-400 p-4 rounded-md mb-4'>
                    <Text className='text-black font-bold'>Remove Places</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleAdminAddUser}
                    className='bg-gray-400 p-4 rounded-md mb-4'>
                    <Text className='text-black font-bold'>Add User</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleDashboard}
                    className='bg-gray-400 p-4 rounded-md'>
                    <Text className='text-black font-bold'>Dashboard</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default AdminHomeScreen;