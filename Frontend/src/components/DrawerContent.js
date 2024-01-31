import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

const DrawerContent = (props) => {
    const navigation = useNavigation();
    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
    };

    return (
        <DrawerContentScrollView {...props}>
            <View style={{ padding: 16 }}>
                <Text>User Information</Text>
            </View>

            <TouchableOpacity onPress={() => navigateToScreen('Profile')}>
                <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateToScreen('Settings')}>
                <Text>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateToScreen('Bookmarks')}>
                <Text>Bookmarks</Text>
            </TouchableOpacity>

            {/* Include the default drawer items */}
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
};

export default DrawerContent;