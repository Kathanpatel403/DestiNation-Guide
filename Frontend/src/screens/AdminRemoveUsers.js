import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from '@react-navigation/native';

const AdminRemoveUser = () => {
    const navigation = useNavigation();
    const [userId, setUserId] = useState('');

    const handleRemoveUser = async () => {
        console.log("logic to remove user.")
    };

    return (
        <ImageBackground
      source={require("../../assets/images/home3.jpg")} // Change the path to your image
      style={{ flex: 1 }}
    >
        <View>
        <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    padding: wp(4),
                    marginLeft: wp(2),
                    marginRight: wp(82),
                    backgroundColor: 'white',
                    borderRadius: wp(5),
                    marginTop: wp(8)
                }}
            >
                <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="black" />
            </TouchableOpacity>

            <Text className='text-2xl font-bold mt-[100px] ml-[30px]'>Admin Remove User Screen</Text>

            {/* User ID Input */}
            <TextInput
                className='border p-2 mt-[50px] w-[200px] ml-[70px]'
                placeholder="User ID"
                value={userId}
                onChangeText={(text) => setUserId(text)}
            />

            {/* Remove User Button */}
            <TouchableOpacity onPress={handleRemoveUser} className='bg-gray-400 p-2 font-bold text-[30px] text-center items-center justify-center rounded-md w-[200px] h-[45px] mt-[20px] ml-[70px]'>
                <Text className='text-black font-bold'>Remove User</Text>
            </TouchableOpacity>
        </View>
        </ImageBackground>
    );
};

export default AdminRemoveUser;