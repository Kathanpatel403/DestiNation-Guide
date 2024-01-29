import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/solid";

const AdminDashboard = () => {
    const navigation = useNavigation();
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

            <Text className='text-2xl font-bold mt-[100px] ml-[70px]'>Admin Dashboard</Text>
            <View className='flex-1 justify-center items-center p-4'>
                {/* User Statistics Section */}
                <View className='mb-4'>
                    <Text className='text-xl font-bold mb-2'>User Statistics</Text>
                    {/* Include charts or statistics components here */}
                    <Text>Number of Users: 1000</Text>
                    <Text>Active Users: 800</Text>
                    {/* Add more metrics as needed */}
                </View>

                {/* System Performance Section */}
                <View className='mb-4'>
                    <Text className='text-xl font-bold mb-2'>System Performance</Text>
                    {/* Include charts or performance metrics components here */}
                    <Text>Server Uptime: 99.9%</Text>
                    <Text>Response Time: 50ms</Text>
                    {/* Add more performance metrics as needed */}
                </View>

                {/* Recent Activities Section */}
                <View>
                    <Text className='text-xl font-bold mb-2'>Recent Activities</Text>
                    {/* Include a list or logs of recent activities */}
                    <Text>Admin added a new place.</Text>
                    <Text>User updated their profile.</Text>
                    {/* Add more recent activities as needed */}
                </View>
            </View>
        </ImageBackground>
    );
};

export default AdminDashboard;