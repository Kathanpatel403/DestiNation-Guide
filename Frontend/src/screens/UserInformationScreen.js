import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ImageBackground,
    ToastAndroid,
    ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth, firestore } from "../../config/firebase";
import { doc, updateDoc } from 'firebase/firestore';

export default function UserInformation() {
    const navigation = useNavigation();
    const [categories, setCategories] = useState(['']);
    const [locations, setLocations] = useState(['']);


    const addCategoryField = () => {
        setCategories([...categories, '']); 
    };

    const handleCategoryChange = (index, value) => {
        const updatedCategories = [...categories];
        updatedCategories[index] = value;
        setCategories(updatedCategories);
    };

    const addLocationField = () => {
        setLocations([...locations, '']); 
    };

    const handleLocationChange = (index, value) => {
        const updatedLocations = [...locations];
        updatedLocations[index] = value;
        setLocations(updatedLocations);
    };


    const handleInformation = async () => {
        const user = auth.currentUser;

        if (user) {
            const uid = user.uid;
            const userRoleRef = doc(firestore, "userRoles", uid);

            updateDoc(userRoleRef, {
                LocationPreference: locations,
                CategoryPreference: categories,
            }).then(() => {
                console.log("Preferences set successfully.");
                ToastAndroid.show(`User preference set successfully!`, ToastAndroid.SHORT);
                navigation.navigate("Home");
            }).catch(() => {
                console.error("Error setting Preferences", error);
                ToastAndroid.show(`Error setting Preferences!`, ToastAndroid.SHORT);
            })
        } else {
            console.log("user is not loggedin");
            ToastAndroid.show(`User is not loggedin!`, ToastAndroid.SHORT);
        }
    }

    return (
        <ImageBackground
            source={require("../../assets/images/home3.jpg")}
            style={{ flex: 1 }}
        >
            <View className="flex-1 ">
                <SafeAreaView className="flex">
                    <View className="flex-row justify-center">
                        <Image
                            source={require("../../assets/images/logo.png")}
                            style={{ width: 165, height: 110 }}
                        />
                    </View>
                </SafeAreaView>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                    <View
                        className="flex-1 bg-white px-8 pt-8"
                        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
                    >

                        <View className="form space-y-2">

                            <Text className="text-gray-700 ml-4">Location Preferences</Text>
                            {locations.map((location, index) => (
                                <TextInput
                                    key={index}
                                    className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                    placeholder={`Location ${index + 1}`}
                                    value={location}
                                    onChangeText={(value) => handleLocationChange(index, value)}
                                />
                            ))}

                            <TouchableOpacity
                                onPress={addLocationField}
                                className="py-3 bg-gray-400 rounded-xl"
                            >
                                <Text className="font-xl font-bold text-center text-black">
                                    Add Locations
                                </Text>
                            </TouchableOpacity>

                            <Text className="text-gray-700 ml-4">Category Preferences</Text>
                            {categories.map((category, index) => (
                                <TextInput
                                    key={index}
                                    className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                    placeholder={`Category ${index + 1}`}
                                    value={category}
                                    onChangeText={(value) => handleCategoryChange(index, value)}
                                />
                            ))}

                            <TouchableOpacity
                                onPress={addCategoryField}
                                className="py-3 bg-gray-400 rounded-xl"
                            >
                                <Text className="font-xl font-bold text-center text-black">
                                    Add Category
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleInformation}
                                className="py-3 bg-gray-400 rounded-xl"
                            >
                                <Text className="font-xl font-bold text-center text-black">
                                    Submit Information
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}