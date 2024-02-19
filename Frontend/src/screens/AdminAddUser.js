import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ImageBackground,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { theme } from '../theme';

const AdminAddUser = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleAddUser = async () => {
        if (email && password) {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                navigation.navigate("Home");
            } catch (err) {
                console.log("got error: ", err.message);
            }
        }
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

            <View className="flex-1 mt-[100px]">
                <Text className='text-2xl font-bold mb-[60px] ml-[50px]'>Admin Add User Screen</Text>
                <View
                    className="flex-1 px-8 pt-8"
                    style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
                >

                    <View className="form space-y-2">
                        <Text className="text-gray-700 ml-4">Full Name</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                            value={name}
                            onChangeText={(value) => setName(value)}
                            placeholder="Enter Name"
                        />
                        <Text className="text-gray-700 ml-4">Email Address</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                            placeholder="Enter Email"
                        />
                        <Text className="text-gray-700 ml-4">Password</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
                            secureTextEntry
                            value={password}
                            onChangeText={(value) => setPassword(value)}
                            placeholder="Enter Password"
                        />
                        <TouchableOpacity
                            className="py-3 bg-gray-400 rounded-xl"
                            onPress={handleAddUser}
                        >
                            <Text className="font-xl font-bold text-center text-black">
                                Add User
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
};

export default AdminAddUser;