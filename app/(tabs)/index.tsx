import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "AIR MAX 270 REACT",
    brand: "NIKE",
    price: 119.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "2",
    name: "CLASSIC LEATHER",
    brand: "REEBOK",
    price: 99.6,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "3",
    name: "SUPERSTAR",
    brand: "ADIDAS",
    price: 89.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "4",
    name: "AIR MAX 95",
    brand: "NIKE",
    price: 139.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
];

const BRANDS = ["ALL", "NIKE", "ADIDAS", "REEBOK", "VANS"];

export default function HomeScreen() {
  const [selectedBrand, setSelectedBrand] = React.useState("ALL");

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://via.placeholder.com/40/496c60/FFFFFF?text=J" }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-sm text-gray-500">Hi, Jelly 👋</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View className="mx-5 my-4 bg-yellow-100 rounded-2xl p-5 overflow-hidden">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-xs text-gray-600 mb-1">🔥 New</Text>
              <Text className="text-xl font-bold text-gray-900 mb-3">
                NEW SUMMER{"\n"}COLLECTION
              </Text>
              <TouchableOpacity className="rounded-full px-5 py-2 self-start flex-row items-center" style={{ backgroundColor: '#496c60' }}>
                <Ionicons name="play" size={16} color="#fff" />
                <Text className="text-white text-sm font-semibold ml-1">
                  Shop Now
                </Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{
                uri: "https://via.placeholder.com/120/FF6347/FFFFFF?text=Shoe",
              }}
              className="w-28 h-28"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Search Bar */}
        <View className="mx-5 mb-4">
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Search Collections..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-gray-900"
            />
          </View>
        </View>

        {/* Brand Filter */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {BRANDS.map((brand, index) => (
              <TouchableOpacity
                key={brand}
                onPress={() => setSelectedBrand(brand)}
                className="mr-3 px-5 py-2 rounded-full"
                style={{
                  backgroundColor: selectedBrand === brand ? '#496c60' : '#f3f4f6'
                }}
              >
                <Text
                  className={`font-semibold ${
                    selectedBrand === brand ? "text-white" : "text-gray-700"
                  }`}
                >
                  {brand}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Discover Section */}
        <View className="px-5 mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-1 h-6 rounded mr-2" style={{ backgroundColor: '#496c60' }} />
              <Text className="text-xl font-bold text-gray-900">Discover</Text>
            </View>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm text-gray-600 mr-1">View All</Text>
              <Ionicons name="arrow-forward" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Products Grid */}
        <View className="px-5 pb-24">
          <View className="flex-row flex-wrap justify-between">
            {MOCK_PRODUCTS.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="w-[48%] bg-white rounded-2xl p-2 mb-4 shadow-sm"
              >
                <Image
                  source={{ uri: product.image }}
                  className="w-full h-32 rounded-xl mb-3"
                  resizeMode="cover"
                />
                <Text className="text-xs text-gray-500 mb-1">
                  {product.brand}
                </Text>
                <Text
                  className="text-sm font-semibold text-gray-900 mb-2"
                  numberOfLines={2}
                >
                  {product.name}
                </Text>
                <Text className="text-base font-bold text-gray-900">
                  USD {product.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export const unstable_settings = {
  title: "Home",
};