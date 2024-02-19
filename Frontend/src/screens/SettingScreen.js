import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from '@react-navigation/native';

const SettingScreen = () => {
    const navigation = useNavigation();

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

                <Text className='text-2xl font-bold mt-[100px] ml-[30px]'>Settings Screen</Text>

            </View>
        </ImageBackground>
    );
};

export default SettingScreen;