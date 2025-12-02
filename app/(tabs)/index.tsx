import ProductCard from "@/components/product/product_card";
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
const FOR_YOU_PRODUCTS = [
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

const POPULAR_PRODUCTS = [
  {
    id: "5",
    name: "AIR JORDAN 1",
    brand: "NIKE",
    price: 169.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "6",
    name: "ULTRABOOST",
    brand: "ADIDAS",
    price: 159.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "7",
    name: "CLUB C 85",
    brand: "REEBOK",
    price: 79.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "8",
    name: "OLD SKOOL",
    brand: "VANS",
    price: 69.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
];

const NEWEST_PRODUCTS = [
  {
    id: "9",
    name: "ZOOM FLY 5",
    brand: "NIKE",
    price: 189.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "10",
    name: "NMD_R1",
    brand: "ADIDAS",
    price: 149.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "11",
    name: "SUEDE CLASSIC",
    brand: "PUMA",
    price: 89.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "12",
    name: "SK8-HI",
    brand: "VANS",
    price: 74.9,
    image: "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
];

const BRANDS = [
  { name: "ALL", logo: null },
  { name: "NIKE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/512px-Logo_NIKE.svg.png" },
  { name: "ADIDAS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/512px-Adidas_Logo.svg.png" },
  { name: "PUMA", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Puma_complete_logo.svg/512px-Puma_complete_logo.svg.png" },
  { name: "REEBOK", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Reebok_logo.svg/512px-Reebok_logo.svg.png" },
  { name: "VANS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Vans-logo.svg/512px-Vans-logo.svg.png" },
];

export default function HomeScreen() {
  const [selectedBrand, setSelectedBrand] = React.useState("ALL");

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://cdn.dribbble.com/userupload/31584578/file/original-050b602625e120a96798e483b9199f46.png?format=webp&resize=450x338&vertical=center" }}
              className="w-14 h-14 rounded-lg"
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

        {/* Popular Brand */}
        <View className="mb-4 px-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">Popular Brand</Text>
            <TouchableOpacity>
              <Text className="text-sm" style={{ color: '#496c60' }}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {BRANDS.map((brand) => (
              <TouchableOpacity
                key={brand.name}
                onPress={() => setSelectedBrand(brand.name)}
                className="mr-3 items-center"
              >
                <View 
                  className="rounded-full p-3 items-center justify-center"
                  style={{
                    width: 70,
                    height: 70,
                    backgroundColor: selectedBrand === brand.name ? '#e8f5e9' : '#f5f5f5',
                    borderWidth: selectedBrand === brand.name ? 1 : 0,
                    borderColor: '#496c60',
                  }}
                >
                  {brand.logo ? (
                    <Image
                      source={{ uri: brand.logo }}
                      style={{ width: 40, height: 40}}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text className="text-xl font-bold text-gray-400">All</Text>
                  )}
                </View>
                <Text 
                  className="text-xs mt-1 font-medium"
                  style={{
                    color: selectedBrand === brand.name ? '#496c60' : '#6b7280'
                  }}
                >
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* For You Section */}
        <View className="mb-6">
          <View className="px-5 mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">For you</Text>
            <TouchableOpacity>
              <Text className="text-sm" style={{ color: '#496c60' }}>View All →</Text>
            </TouchableOpacity>
          </View>
          <View className="px-5">
            <View className="flex-row flex-wrap justify-between">
              {FOR_YOU_PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Popular Section */}
        <View className="mb-6">
          <View className="px-5 mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">Popular</Text>
            <TouchableOpacity>
              <Text className="text-sm" style={{ color: '#496c60' }}>View All →</Text>
            </TouchableOpacity>
          </View>
          <View className="px-5">
            <View className="flex-row flex-wrap justify-between">
              {POPULAR_PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Newest Section */}
        <View className="mb-6 pb-24">
          <View className="px-5 mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">Newest</Text>
            <TouchableOpacity>
              <Text className="text-sm" style={{ color: '#496c60' }}>View All →</Text>
            </TouchableOpacity>
          </View>
          <View className="px-5">
            <View className="flex-row flex-wrap justify-between">
              {NEWEST_PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export const unstable_settings = {
  title: "Home",
};