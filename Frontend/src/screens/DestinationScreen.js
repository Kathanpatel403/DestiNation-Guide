import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/solid";
import { theme } from "../theme";
import { styled } from "nativewind";
import logoImage from "../../assets/images/logo.png";

const ios = Platform.OS == "ios";

const AnimatedText = Animatable.createAnimatableComponent(Text);

export default function DestinationScreen(props) {
  const item = props.route.params;

  const navigation = useNavigation();
  const [isFavourite, toggleFavourite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = [
    { name: "Kakariya Lack", key: "1" },
    { name: "kakariya2", key: "2" },
    { name: "kakariya3", key: "3" },
    { name: "kakariya3", key: "4" },
    { name: "kakariya3", key: "5" },
    // Add more items as needed
  ];
  
 

  
  const fadeAnim = new Animated.Value(0);
  const flatListRef = useRef();
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / wp(100));
    setCurrentIndex(newIndex);
  };
  
  const handleDirectionPress = () => {
    // Navigate to the MapScreen when the "Direction" button is pressed
    navigation.navigate('MapScreen', {
      destinationName: item.name,
      destinationLatitude: item.latitude,
      destinationLongitude: item.longitude,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
    }, 1500);
  
    return () => clearInterval(interval);
  }, [currentIndex, data]);

  return (
    <ImageBackground
      source={require("../../assets/images/home3.jpg")} // Change the path to your image
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
        
<FlatList
  style={{
    width: wp(88),
    margin: 20,
    borderRadius: 40,
  }}
  ref={flatListRef}
  data={data}
  keyExtractor={(item) => item.key}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { x: fadeAnim } } }],
    {
      useNativeDriver: false,
      listener: handleScroll,
    }
  )}
  renderItem={({ item: image,index }) => (
    <Animated.Image
      animation="fadeIn"
      source={{ uri: item.image[index] }}
      style={{
        resizeMode: "cover",
        marginTop: 10,
        width: wp(85),
        height: hp(40),
        marginBottom: -200,
        overflow: "hidden",
        borderRadius: 30,
        margin: 10,
      }}
    />
  )}
/>


          <StatusBar style="light" />

          <SafeAreaView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              position: "absolute",
              marginTop: ios ? 0 : hp(2),
              paddingHorizontal: wp(2),
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: wp(4),
                marginLeft: wp(2),
                backgroundColor: theme.bgDark,
                borderRadius: wp(5),
              }}
            >
              <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleFavourite(!isFavourite)}
              style={{
                padding: wp(6),
                marginRight: wp(2),
                backgroundColor: theme.bgDark,
                borderRadius: wp(5),
              }}
            >
              <HeartIcon
                size={wp(7)}
                strokeWidth={4}
                color={isFavourite ? "red" : "white"}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
        <View
          style={{
            // marginTop: -200,
            flex: 1,
          }}
        >
          <Animatable.View
            animation="fadeInUpBig"
            style={{
              backgroundColor: theme.bgGrey,
              // borderRadius: wp(3),
              paddingLeft: 100,
              marginTop: -40,
              marginBottom: hp(3),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AnimatedText
                animation="fadeIn"
                style={{
                  fontSize: wp(7),
                  fontWeight: "bold",
                  color: theme.textDark,
                }}
              >
                {item?.name}
              </AnimatedText>
            </View>
          </Animatable.View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ padding: wp(5), paddingBottom: hp(1) }}
          >
           <Animatable.View
  animation="fadeInUpBig"
  delay={200}
  style={{
    backgroundColor: "#e3e3e3", // Adjust background color as needed
    borderRadius: wp(5), // Slightly increased border radius
    padding: wp(4),
    marginBottom: hp(3),
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // For Android shadow
    borderWidth: 1, // Border width
    borderColor: "#ccc",
     // Border color
  }}
>
  <LinearGradient
    colors={['#e6e6e6', '#e3e3e3']} // Adjust gradient colors as needed
    style={{
      flex: 1,
      borderRadius: wp(6), // Slightly increased border radius
      padding: wp(4),
     
      alignItems: 'center',
      
  
    }}
  >
    <AnimatedText
      style={{
        fontSize: wp(3.7),
        color: theme.textDark,
        marginTop: hp(0.1),
        textAlign: 'justify',
        lineHeight: hp(2.5),
        letterSpacing:0.5
      }}
    >
      {item?.description}
    </AnimatedText>
  </LinearGradient>
</Animatable.View>


<Animatable.View
  animation="fadeInUpBig"
  delay={200}
  style={{
    backgroundColor: "#e3e3e3",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(3),
    flexDirection: "row", // Use a flex container to align text and icon horizontally
    alignItems: "center", 
    backgroundColor: "#e3e3e3", // Adjust background color as needed
    borderRadius: wp(5), // Slightly increased border radius
    padding: wp(4),
    marginBottom: hp(3),
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // For Android shadow
    borderWidth: 1, // Border width
    borderColor: "#ccc",// Align items vertically in the flex container
  }}
>
  {/* Location Icon or Image */}
  <Image
    source={require("../../assets/images/ho.png")} // Replace with the actual path to your location icon/image
    style={{
      width: wp(15), // Adjust the width of the image/icon as needed
      height: wp(12), // Adjust the height of the image/icon as needed
      marginRight: wp(1),
      marginLeft:-10,
      marginBottom:-15 // Adjust the margin between icon/image and text
    }}
  />

  {/* Text Content */}
  <View>
    <Text
      style={{
        fontSize: wp(5),
        fontWeight: "bold",
        color: theme.textDark,
      }}
    >
      Location
    </Text>
    <Text style={{ fontSize: wp(3.7),
        color: theme.textDark,
        marginTop: hp(0.1),
        textAlign: 'justify',
        lineHeight: hp(2.5),
        letterSpacing:0.5}}>
      {item?.city}, {item?.state},{" "}
      {item?.country},{"\n"}({item?.latitude},{" "}
      {item?.longitude})
    </Text>
  </View>
</Animatable.View>

            {/* Activities Section */}
            <Animatable.View
  animation="fadeInUpBig"
  delay={600}
  style={{
    backgroundColor: "#e3e3e3", // Lighter background color
    borderRadius: wp(8),
    padding: wp(6),
    marginBottom: hp(3),
    alignItems: "flex-start", // Align text to the left
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#ccc", // Light border color
  }}
>
  <Text
    style={{
      fontSize: wp(6),
      fontWeight: "bold",
      color: "#333", // Darker text color
      marginBottom: hp(2),
    }}
  >
    Activities
  </Text>
  <View
    style={{
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    {item?.activities?.map((activity, index) => (
      <View
        key={index}
        style={{
          flexDirection: "row",
          alignItems: "center",
          fontColor:'white',
          marginVertical: hp(1),
          backgroundColor: index % 2 === 0 ? "#999999" : "#999999", // Alternating background colors
          padding: wp(2),
          borderRadius: wp(4),
          marginRight: wp(2),
        }}
      >
        <View
          style={{
            width: wp(3),
            height: wp(3),
            borderRadius: wp(2),
            backgroundColor: "#000", // Circle color
            alignItems: "center",
            justifyContent: "center",
            marginRight: wp(1),
          }}
        >
          <FontAwesome name="circle" size={wp(1.5)} color="#FFF" />
        </View>
        <Text style={{ fontSize: wp(4.5), color: "#f2f2f2" }}>{activity}</Text>
      </View>
    ))}
  </View>
</Animatable.View>




            {/* Amenities Section */}
            <Animatable.View
  animation="fadeInUpBig"
  delay={600}
  style={{
    backgroundColor: "#e3e3e3", // Lighter background color
    borderRadius: wp(8),
    padding: wp(6),
    marginBottom: hp(3),
    alignItems: "flex-start", // Align text to the left
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#ccc", // Light border color
  }}
>
  <Text
    style={{
      fontSize: wp(6),
      fontWeight: "bold",
      color: "#333", // Darker text color
      marginBottom: hp(2),
    }}
  >
  Amenities
  </Text>
  <View
    style={{
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "center",
    }}
  >
  {item?.amenities?.map((amenity, index) => (
      <View
        key={index}
        style={{
          flexDirection: "row",
          alignItems: "center",
          fontColor:'white',
          marginVertical: hp(1),
          backgroundColor: index % 2 === 0 ? "#999999" : "#999999", // Alternating background colors
          padding: wp(2),
          borderRadius: wp(4),
          marginRight: wp(2),
        }}
      >
        <View
          style={{
            width: wp(3),
            height: wp(3),
            borderRadius: wp(2),
            backgroundColor: "#000", // Circle color
            alignItems: "center",
            justifyContent: "center",
            marginRight: wp(1),
          }}
        >
          <FontAwesome name="circle" size={wp(1.5)} color="#FFF" />
        </View>
        <Text style={{ fontSize: wp(4.5), color: "#f2f2f2" }}>{amenity}</Text>
      </View>
    ))}
  </View>
</Animatable.View>







            {/* Reviews Section */}
            {/* <Animatable.View
  animation="fadeInUpBig"
  delay={1000}
  style={{
    backgroundColor: "#e3e3e3",
    borderRadius: wp(3),
    // padding: wp(4),
    marginBottom: hp(3),
    // flexDirection: "row", // Use a flex container to align text and icon horizontally
   
    backgroundColor: "#e3e3e3", // Adjust background color as needed
    borderRadius: wp(5), // Slightly increased border radius
    // padding: wp(4),
    marginBottom: hp(3),
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // For Android shadow
    borderWidth: 1, 
    borderColor: "#ccc"// Border width
  }}
>
  <Text
    style={{
      fontSize: wp(5),
      fontWeight: "bold",
      marginBottom:10,
      backgroundColor:'#e9e9e9',
      width:220,
      height:50,
      padding:10,
      marginLeft:75,
      borderRadius:wp(5)

    }}
  >
    Reviews and Ratings
  </Text>
  {item?.reviews?.map((review, index) => (
    <View key={index} style={{ marginBottom: hp(2), flexDirection: "row" }}>
      {/* Display Author's Profile Picture */}
      {/* <Image
        source={logoImage}
        style={{
          width: wp(21),
          height: wp(20),
          borderRadius: wp(4),
          marginRight: wp(2),
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: wp(4),
            color: theme.textLight,
            fontWeight: "bold",
            marginBottom: hp(1),
          }}
        >
          {review.user}
        </Text>
        <Text style={{ fontSize: wp(3.5), color: theme.textLight }}>
          {review.comment}
        </Text>
        {/* Display Ratings (Assuming rating is a number out of 5) */}
        {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: hp(1) }}>
          <FontAwesome name="star" size={wp(4)} color="#FFD700" style={{ marginRight: wp(1) }} />
          <Text style={{ fontSize: wp(4), color: theme.textLight }}>{review.rating}/5</Text>
        </View>
      </View>
    </View>
  ))}
</Animatable.View> */} 


<Animatable.View
        animation="fadeInUpBig"
        delay={1200}
        style={{ marginTop: hp(0.1) }}
      >
        <TouchableOpacity
          className="py-3 mb-[100px] bg-gray-400 rounded-xl"
          onPress={handleDirectionPress}
        >
          <Text className='text-xl font-bold text-center text-black'>
            Direction
          </Text>
        </TouchableOpacity>
      </Animatable.View>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}
