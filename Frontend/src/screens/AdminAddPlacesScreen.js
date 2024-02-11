import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, SafeAreaView, ScrollView, Alert } from 'react-native';
import Picker from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { theme } from '../theme';

const AdminAddPlacesScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [activities, setActivities] = useState("");
    const [amenities, setAmenities] = useState("");
    const [timings, setTimings] = useState("");
    const [fee, setFee] = useState("");
    const [userReviewRating, setUserReviewRating] = useState("");
    const [tip, setTip] = useState("");
    const [bmtv, setBmtv] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddPlace = async () => {
        try {
            setLoading(true);
            const placeData = {
                name,
                category,
                city,
                state,
                country,
                latitude,
                longitude,
                longDescription,
                shortDescription,
                activities,
                amenities,
                timings,
                fee,
                userReviewRating,
                tip,
                bmtv
                // Add other fields as needed
            };

            // Placeholder endpoint that logs the place data
            console.log('Place data:', placeData);

            const response = await fetch('http://192.168.145.59:8000/api/places/add/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(placeData),
            });

            if (!response.ok) {
                throw new Error('Failed to add place');
            }

            setName("");
            setCategory("");
            setCity("");
            setState("");
            setCountry("");
            setLatitude("");
            setLongitude("");
            setLongDescription("");
            setShortDescription("");
            setActivities("");
            setAmenities("");
            setTimings("");
            setFee("");
            setUserReviewRating("");
            setTip("");
            setBmtv("");

            setLoading(false);
            Alert.alert('Success', 'Place added successfully!');
        } catch (error) {
            console.error('Error adding place:', error);
            setLoading(false);
            Alert.alert('Error', 'Failed to add place. Please try again.');
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
                    padding: 16,
                    marginLeft: 8,
                    marginRight: 240,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    marginTop: 20
                }}
            >
                <ChevronLeftIcon size={24} strokeWidth={4} color="black" />
            </TouchableOpacity>

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16 }}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Admin Add Place Screen</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Category"
                        value={category}
                        onChangeText={(text) => setCategory(text)}
                    />

<Text>Select City:</Text>
      <Picker
        selectedValue={city}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setCity(itemValue)}
      >
        <Picker.Item label="Select a city" value="" />
        <Picker.Item label="New York" value="New York" />
        <Picker.Item label="London" value="London" />
        <Picker.Item label="Tokyo" value="Tokyo" />
        {/* Add more cities as needed */}
      </Picker>
      <Text>Selected City: {City}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="State"
                        value={state}
                        onChangeText={(text) => setState(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Country"
                        value={country}
                        onChangeText={(text) => setCountry(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Latitude"
                        value={latitude}
                        onChangeText={(text) => setLatitude(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Longitude"
                        value={longitude}
                        onChangeText={(text) => setLongitude(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Long Description"
                        value={longDescription}
                        onChangeText={(text) => setLongDescription(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Short Description"
                        value={shortDescription}
                        onChangeText={(text) => setShortDescription(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Activities"
                        value={activities}
                        onChangeText={(text) => setActivities(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Amenities"
                        value={amenities}
                        onChangeText={(text) => setAmenities(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Timings"
                        value={timings}
                        onChangeText={(text) => setTimings(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Fee"
                        value={fee}
                        onChangeText={(text) => setFee(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="User Review Rating (JSON)"
                        value={userReviewRating}
                        onChangeText={(text) => setUserReviewRating(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Tip"
                        value={tip}
                        onChangeText={(text) => setTip(text)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Best Months to Visit (BMTV)"
                        value={bmtv}
                        onChangeText={(text) => setBmtv(text)}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleAddPlace}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Add Place</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = {
    input: {
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#4B5563',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
};

export default AdminAddPlacesScreen;
