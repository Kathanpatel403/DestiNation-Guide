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
import { auth, firestore } from "../../config/firebase";
import { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


export default function LoginScreen() {
	const navigation = useNavigation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userRole, setUserRole] = useState(null);
	const [userData, setUserData] = useState(null);

	const handleLogin = async () => {
		if (email && password) {
			try {
				console.log("Trying to login with user!");
				console.log("email trying to login is: ", email);
				await signInWithEmailAndPassword(auth, email, password);
				console.log("Login successful!");
				await fetchUserRole();
			} catch (err) {
				ToastAndroid.show(`got error: ${err.message}`, ToastAndroid.SHORT);
				console.log("got error: ", err.message);
			}
		}
	};

	const fetchUserRole = async () => {
		const user = getAuth().currentUser;

		if (user) {
			const uid = user.uid;
			const userRoleRef = doc(firestore, "userRoles", uid);

			try {
				const docSnapshot = await getDoc(userRoleRef);

				if (docSnapshot.exists()) {
					const role = docSnapshot.data().role;
					setUserRole(role);
					const data = docSnapshot.data().name;
					setUserData(data);

					if (role === "Admin") {
						ToastAndroid.show(`Logging in as: ${data}`, ToastAndroid.SHORT);
						console.log("logging in");
						navigation.navigate("AdminMain");
						setEmail('');
						setPassword('');
					} else if (role === "user") {
						ToastAndroid.show(`Logging in as: ${data}`, ToastAndroid.SHORT);
						console.log("logging in");
						navigation.navigate("Home");
						setEmail('');
						setPassword('');
					}
				} else {
					ToastAndroid.show("User doesn't exist. Please SignUp!", ToastAndroid.SHORT);
					console.log("User doesn't exist. Please SignUp!");
					setUserRole(null);
				}
			} catch (error) {
				ToastAndroid.show(`Error fetching user role: ${error}`, ToastAndroid.SHORT);
				console.error("Error fetching user role:", error);
			}
		}
	};

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
						<Text className="text-gray-700 ml-4">Password</Text>
						<TextInput
							className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
							secureTextEntry
							placeholder="password"
							value={password}
							onChangeText={(value) => setPassword(value)}
						/>
						<TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} className="flex items-end">
							<Text className="text-gray-700 mb-5">Forgot Password?</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="py-3 bg-gray-400 rounded-xl"
							onPress={handleLogin}
						>
							<Text className="text-xl font-bold text-center text-black">
								Login
							</Text>
						</TouchableOpacity>
					</View>
					<Text className="text-xl text-gray-700 font-bold text-center py-5">
						Or
					</Text>
					
					<View className="flex-row justify-center">
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