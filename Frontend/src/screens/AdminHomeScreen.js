import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AdminHomeScreen = () => {

    const navigation = useNavigation();

    const handleAddPlaces = () => {
        // Navigate to the Add Places screen or implement your logic
        navigation.navigate("AdminAddPlace");
    };

    const handleManageUsers = () => {
        // Navigate to the Manage Users screen or implement your logic
        navigation.navigate("AdminManage")
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

            <Text className='text-2xl font-bold mt-[100px] ml-[55px]'>Admin Home Screen</Text>
            <View className='flex-1 justify-center items-center'>
                <TouchableOpacity
                    onPress={handleAddPlaces}
                    className='bg-gray-400 p-4 rounded-md mb-4'>
                    <Text className='text-black font-bold'>Add Places</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleManageUsers}
                    className='bg-gray-400 p-4 rounded-md mb-4'>
                    <Text className='text-black font-bold'>Manage Users</Text>
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