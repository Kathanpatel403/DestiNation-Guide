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
import AdminManageUsers from "../screens/AdminManageUsers";
import AdminDashboard from "../screens/AdminDashboard";
import AdminAddUser from "../screens/AdminAddUser";
import AdminRemoveUser from "../screens/AdminRemoveUsers";
import AdminUpdateUser from "../screens/AdminUpdateUsers";
import AdminAddPlacesScreen from "../screens/AdminAddPlacesScreen";
import MapScreen from "../screens/MapScreen"

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const user = useAuth();

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            options={{ headerShown: false }}
            component={WelcomeScreen}
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
            name="AdminUpdate"
            options={{ headerShown: false }}
            component={AdminUpdateUser}
          />
          <Stack.Screen
            name="AdminAdd"
            options={{ headerShown: false }}
            component={AdminAddUser}
          />
          <Stack.Screen
            name="AdminRemove"
            options={{ headerShown: false }}
            component={AdminRemoveUser}
          />
          <Stack.Screen
          name="LogIn"
          options={{ headerShown: false }}
          component={LoginScreen}
          />
          <Stack.Screen
            name="AdminManage"
            options={{ headerShown: false }}
            component={AdminManageUsers}
          />
          <Stack.Screen
            name="AdminDashboard"
            options={{ headerShown: false }}
            component={AdminDashboard}
          />
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={HomeScreen}
          />
          <Stack.Screen
            name="Profile"
            options={{ headerShown: false }}
            component={ProfileScreen}
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
          name="SignUp"
          options={{ headerShown: false }}
          component={SignUpScreen}
          />
          <Stack.Screen
          name="LogIn"
          options={{ headerShown: false }}
          component={LoginScreen}
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
            name="AdminRemove"
            options={{ headerShown: false }}
            component={AdminRemoveUser}
          />
          <Stack.Screen
            name="AdminUpdate"
            options={{ headerShown: false }}
            component={AdminUpdateUser}
          />
          <Stack.Screen
            name="AdminManage"
            options={{ headerShown: false }}
            component={AdminManageUsers}
          />
          <Stack.Screen
            name="AdminAdd"
            options={{ headerShown: false }}
            component={AdminAddUser}
          />
          <Stack.Screen
            name="AdminDashboard"
            options={{ headerShown: false }}
            component={AdminDashboard}
          />
          <Stack.Screen
            name="MapScreen"
            options={{ headerShown: false }}
            component={MapScreen}
          />
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={HomeScreen}
          />

          <Stack.Screen
            name="Welcome"
            options={{ headerShown: false }}
            component={WelcomeScreen}
          />
          <Stack.Screen
            name="Profile"
            options={{ headerShown: false }}
            component={ProfileScreen}
          />
          <Stack.Screen
            name="CategoryDetails"
            options={{ headerShown: false }}
            component={CategoryDetails}
          />
          <Stack.Screen
            name="Destination"
            options={{ headerShown: false }}
            component={DestinationScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}