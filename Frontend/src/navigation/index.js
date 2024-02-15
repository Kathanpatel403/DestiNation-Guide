import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import DestinationScreen from "../screens/DestinationScreen";
import CategoryDetails from "../components/CategoryDetails";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignupScreen";
import useAuth from "../../hooks/useAuth";
import AdminHomeScreen from "../screens/AdminHomeScreen";
import AdminDashboard from "../screens/AdminDashboard";
import AdminAddUser from "../screens/AdminAddUser";
import AdminAddPlacesScreen from "../screens/AdminAddPlacesScreen";
import MapScreen from "../screens/MapScreen"
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import SettingScreen from "../screens/SettingScreen";
import BookmarkScreen from "../screens/BookmarkScreen";
import UserInformation from "../screens/UserInformationScreen";
import UpdateUserInfoScreen from "../screens/UpdateUserInfoScreen";
import AdminMainScreen from "../screens/AdminMainScreen";
import AdminRemovePlace from "../screens/AdminRemovePlace";
import AdminUpdatePlace from "../screens/AdminUpdatePlace";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const user = useAuth();

  if (user) {
    return (
      <NavigationContainer >
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={HomeScreen}
          />
          <Stack.Screen
            name="AdminHome"
            options={{ headerShown: false }}
            component={AdminHomeScreen}
          />
          <Stack.Screen
            name="AdminAddPlace"
            options={{ headerShown: false }}
            component={AdminAddPlacesScreen}
          />
          
          <Stack.Screen
            name="AdminMain"
            options={{ headerShown: false }}
            component={AdminMainScreen}
          />
          <Stack.Screen
            name="AdminAdd"
            options={{ headerShown: false }}
            component={AdminAddUser}
          />
          <Stack.Screen
            name="AdminRemovePlace"
            options={{ headerShown: false }}
            component={AdminRemovePlace}
          />
          <Stack.Screen
            name="AdminUpdatePlace"
            options={{ headerShown: false }}
            component={AdminUpdatePlace}
          />
          <Stack.Screen
            name="AdminDashboard"
            options={{ headerShown: false }}
            component={AdminDashboard}
          />
          <Stack.Screen
            name="Welcome"
            options={{ headerShown: false }}
            component={WelcomeScreen}
          />
          <Stack.Screen
            name="LogIn"
            options={{ headerShown: false }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="UserInformation"
            options={{ headerShown: false }}
            component={UserInformation}
          />
          <Stack.Screen
            name="UpdateInfo"
            options={{ headerShown: false }}
            component={UpdateUserInfoScreen}
          />
          <Stack.Screen
            name="Profile"
            options={{ headerShown: false }}
            component={ProfileScreen}
          />
          <Stack.Screen
            name="Settings"
            options={{ headerShown: false }}
            component={SettingScreen}
          />
          <Stack.Screen
            name="Bookmarks"
            options={{ headerShown: false }}
            component={BookmarkScreen}
          />
          <Stack.Screen
            name="CategoryDetails"
            options={{ headerShown: false }}
            component={CategoryDetails}
          />
          <Stack.Screen
            name="MapScreen"
            options={{ headerShown: false }}
            component={MapScreen}
          />
          <Stack.Screen
            name="Destination"
            options={{ headerShown: false }}
            component={DestinationScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="LogIn"
            options={{ headerShown: false }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="SignUp"
            options={{ headerShown: false }}
            component={SignUpScreen}
          />
          <Stack.Screen
            name="UserInformation"
            options={{ headerShown: false }}
            component={UserInformation}
          />
          <Stack.Screen
            name="ForgotPassword"
            options={{ headerShown: false }}
            component={ForgotPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}