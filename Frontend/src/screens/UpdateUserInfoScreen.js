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
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";

export default function UpdateUserInfoScreen() {
    const navigation = useNavigation();

    const [categories, setCategories] = useState(['']);
    const [locations, setLocations] = useState(['']);
    const [name, setName] = useState("");

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

            const updateObject = {};

            if (name.length !== 0) {
                updateObject.name = name;
            }

            // Check if the 'locations' field is provided and not empty
            // if (locations.length !== 0) {
            //     updateObject.LocationPreference = locations;
            // }

            // // Check if the 'categories' field is provided and not empty
            // if (categories.length !== 0) {
            //     updateObject.CategoryPreference = categories;
            // }

            if (Array.isArray(locations) && locations.some(value => value.trim() !== '')) {
                updateObject.LocationPreference = locations.map(value => value.trim());
            }
            
            // Check if the 'categories' field is provided, not null, and the array has non-empty elements
            if (Array.isArray(categories) && categories.some(value => value.trim() !== '')) {
                updateObject.CategoryPreference = categories.map(value => value.trim());
            }

            console.log(updateObject)
            updateDoc(userRoleRef, updateObject).then(() => {
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

            <View className="flex-1">
                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile")}
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
                <SafeAreaView className="flex mt-[-20px]">
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
                            <Text className="text-gray-700 ml-4">Name</Text>
                            <TextInput
                                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                                value={name}
                                onChangeText={(value) => setName(value)}
                                placeholder="Enter Name"
                            />
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