import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import MapView, { Marker, Polyline,Callout } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = ({ route }) => {
  const { destinationName, destinationLatitude, destinationLongitude } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState([]);
  const [distance, setDistance] = useState(null);
  const [calloutVisible, setCalloutVisible] = useState(true);

  const handleMapLayout = () => {
    // After the map layout is calculated, set the callout to be visible
    
  };
  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied. Please grant permission to use the map.');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        if (isMounted) {
          setUserLocation({ latitude, longitude });

          const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
          const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=${destinationLatitude},${destinationLongitude}&key=${apiKey}`;

          const response = await fetch(directionsUrl);
          const data = await response.json();

          if (data.routes.length > 0 && data.routes[0].overview_polyline) {
            setDirections(data.routes[0].overview_polyline.points);

            // Calculate distance
            const distanceValue = data.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0);
            console.log(distanceValue);
            setDistance((distanceValue / 1000).toFixed(2)); // Convert to kilometers
          }
        }
      } catch (error) {
        console.error('Error fetching directions:', error);
      }
    };

    getLocation();
    setCalloutVisible(true);  
    return () => {
      // Cleanup function to execute when the component is unmounted
      isMounted = false;
    };
  }, [destinationLatitude, destinationLongitude]);

  return (
    <View style={styles.container}>
      {userLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onLayout={handleMapLayout}
        >
          {/* User Location Marker */}
          <Marker
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            title="Your Location"
            description="You are here"
            pinColor="blue"
          />
          {/* Destination Marker */}
          <Marker
  coordinate={{
    latitude: destinationLatitude,
    longitude: destinationLongitude,
  }}
  
  
>
 
              <Callout>
                <View style={styles.customMarker}>
                  <Text style={styles.markerText}>{destinationName}</Text>
                </View>
              </Callout>
            
</Marker>



          {/* Display Directions */}
          {directions.length > 0 && (
            <Polyline
              coordinates={decodePolyline(directions)}
              strokeColor="#3498db"
              strokeWidth={4}
            />
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          {/* Loading indicator or message */}
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
};

const decodePolyline = (polyline) => {
  // Your polyline decoding logic here
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customMarker: {
    backgroundColor: 'grey',
    padding: 5,
    borderRadius: 5,
    borderColor:'black'
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign:'center',
    
  },

 
});




export default MapScreen;
