import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/solid";

const AdminManageUsers = () => {

    const navigation = useNavigation();
    const handleAddUser = () => {
        // Navigate to the Add User screen or implement your logic
        navigation.navigate("AdminAdd");
    };

    const handleRemoveUser = () => {
        // Navigate to the Remove User screen or implement your logic
        navigation.navigate("AdminRemove")
    };

    const handleUpdateUser = () => {
        // Navigate to the Update User screen or implement your logic
        navigation.navigate("AdminUpdate")
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
                    marginRight: wp(82),
                    backgroundColor: 'white',
                    borderRadius: wp(5),
                    marginTop: wp(10)
                }}
            >
                <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="black" />
            </TouchableOpacity>
                <Text className='text-2xl font-bold mt-[100px] ml-[23px]'>Admin Manage User Screen</Text>
                <View className='flex-1 justify-center items-center'>
                <TouchableOpacity
                    onPress={handleAddUser}
                    className='bg-gray-400 p-4 rounded-md mb-4'>
                    <Text className='text-black font-bold'>Add User</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleRemoveUser}
                    className='bg-gray-400 p-4 rounded-md mb-4'>
                    <Text className='text-black font-bold'>Remove User</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleUpdateUser}
                    className='bg-gray-400 p-4 rounded-md'>
                    <Text className='text-black font-bold'>Update User</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default AdminManageUsers;