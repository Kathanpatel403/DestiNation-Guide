// import * as Network from "expo-network";


// const getIpAddress = async () => {
//   try {
//     const ip = await Network.getIpAddressAsync();
//     return ip;
//   } catch (error) {
//     console.error('Error getting IP address:', error);
//     throw error;
//   }
// };


let BASE_URL = `http://192.168.123.141:8000/`
console.log(BASE_URL)

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


// export const fetchData = async (endpoint) => {
//   try {
//     const ip = await getIpAddress();
//     const BASE_URL = `http://${ip}:8000/`;
//     console.log(BASE_URL);
//     const response = await fetch(`${BASE_URL}${endpoint}`);
//     const data = await response.json();

//     return data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// };