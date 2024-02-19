import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ImageBackground,
    ToastAndroid
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../config/firebase";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";


export default function ForgotPasswordScreen() {

    const navigation = useNavigation();
    const [email, setEmail] = useState("");

    const forgotPasswordhandler = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            ToastAndroid.show('Password reset link sent successfully!', ToastAndroid.SHORT);
            console.log('Password reset link sent successfully!');
        } catch (error) {
            ToastAndroid.show(`Error occurred: ${error.message}`, ToastAndroid.SHORT);
            console.error(`Error occurred: ${error.message}`);
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/images/home3.jpg")} // Change the path to your image
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
                <View
                    style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
                    className="flex-1 bg-white px-8 pt-8"
                >
                    <View className="form space-y-2">
                        <Text className="text-gray-700 ml-4">Email Address</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                            placeholder="email"
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                        />

                        <TouchableOpacity
                            className="py-3 bg-gray-400 rounded-xl"
                            onPress={forgotPasswordhandler}
                        >
                            <Text className="text-xl font-bold text-center text-black">
                                Send Code
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center mt-7">
                        <Text className="text-black font-semibold">
                            Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                            <Text className="font-semibold text-gray-500"> Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}