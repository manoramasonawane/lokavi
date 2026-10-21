export interface CityPinLocation {
  city: string;
  district: string;
  state: string;
  pinCode: string;
  lat: number;
  lng: number;
}

export const CITY_PIN_DIRECTORY: CityPinLocation[] = [
  // Maharashtra Key Hubs
  { city: 'Shirpur', district: 'Dhule', state: 'Maharashtra', pinCode: '425405', lat: 21.3508, lng: 74.8805 },
  { city: 'Dhule', district: 'Dhule', state: 'Maharashtra', pinCode: '424001', lat: 20.9042, lng: 74.7749 },
  { city: 'Pune', district: 'Pune', state: 'Maharashtra', pinCode: '411001', lat: 18.5204, lng: 73.8567 },
  { city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', pinCode: '400001', lat: 18.9388, lng: 72.8354 },
  { city: 'Nashik', district: 'Nashik', state: 'Maharashtra', pinCode: '422001', lat: 19.9975, lng: 73.7898 },
  { city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', pinCode: '440001', lat: 21.1458, lng: 79.0882 },
  { city: 'Chhatrapati Sambhaji Nagar (Aurangabad)', district: 'Chhatrapati Sambhaji Nagar', state: 'Maharashtra', pinCode: '431001', lat: 19.8762, lng: 75.3433 },
  { city: 'Mahabaleshwar', district: 'Satara', state: 'Maharashtra', pinCode: '412806', lat: 17.9237, lng: 73.6586 },
  { city: 'Kolhapur', district: 'Kolhapur', state: 'Maharashtra', pinCode: '416001', lat: 16.7050, lng: 74.2433 },
  { city: 'Solapur', district: 'Solapur', state: 'Maharashtra', pinCode: '413001', lat: 17.6599, lng: 75.9064 },
  { city: 'Amravati', district: 'Amravati', state: 'Maharashtra', pinCode: '444601', lat: 20.9374, lng: 77.7796 },
  { city: 'Jalgaon', district: 'Jalgaon', state: 'Maharashtra', pinCode: '425001', lat: 21.0077, lng: 75.5626 },
  { city: 'Nandurbar', district: 'Nandurbar', state: 'Maharashtra', pinCode: '425412', lat: 21.3698, lng: 74.2404 },
  { city: 'Saputara', district: 'Dang', state: 'Gujarat', pinCode: '394740', lat: 20.5779, lng: 73.7483 },

  // Key Inter-State Hubs
  { city: 'Delhi', district: 'Central Delhi', state: 'Delhi', pinCode: '110001', lat: 28.6139, lng: 77.2090 },
  { city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', pinCode: '302001', lat: 26.9124, lng: 75.7873 },
  { city: 'Udaipur', district: 'Udaipur', state: 'Rajasthan', pinCode: '313001', lat: 24.5854, lng: 73.7125 },
  { city: 'Panaji', district: 'North Goa', state: 'Goa', pinCode: '403001', lat: 15.4909, lng: 73.8278 },
  { city: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', pinCode: '221001', lat: 25.3176, lng: 82.9739 },
  { city: 'Agra', district: 'Agra', state: 'Uttar Pradesh', pinCode: '282001', lat: 27.1767, lng: 78.0081 },
  { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', pinCode: '500001', lat: 17.3850, lng: 78.4867 },
  { city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', pinCode: '560001', lat: 12.9716, lng: 77.5946 },
  { city: 'Mysuru', district: 'Mysuru', state: 'Karnataka', pinCode: '570001', lat: 12.2958, lng: 76.6394 },
  { city: 'Kochi', district: 'Ernakulam', state: 'Kerala', pinCode: '682001', lat: 9.9312, lng: 76.2673 },
  { city: 'Munnar', district: 'Idukki', state: 'Kerala', pinCode: '685612', lat: 10.0889, lng: 77.0595 },
  { city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', pinCode: '600001', lat: 13.0827, lng: 80.2707 },
  { city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', pinCode: '625001', lat: 9.9252, lng: 78.1198 },
  { city: 'Amritsar', district: 'Amritsar', state: 'Punjab', pinCode: '143001', lat: 31.6340, lng: 74.8723 },
  { city: 'Rishikesh', district: 'Dehradun', state: 'Uttarakhand', pinCode: '249201', lat: 30.0869, lng: 78.2676 },
  { city: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh', pinCode: '171001', lat: 31.1048, lng: 77.1734 },
  { city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', pinCode: '700001', lat: 22.5726, lng: 88.3639 },
  { city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', pinCode: '380001', lat: 23.0225, lng: 72.5714 },
  { city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh', pinCode: '462001', lat: 23.2599, lng: 77.4126 },
  { city: 'Indore', district: 'Indore', state: 'Madhya Pradesh', pinCode: '452001', lat: 22.7196, lng: 75.8577 },
  { city: 'Srinagar', district: 'Srinagar', state: 'Jammu and Kashmir', pinCode: '190001', lat: 34.0837, lng: 74.7973 }
];
