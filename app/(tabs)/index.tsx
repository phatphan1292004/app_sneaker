import BrandFilter from "@/components/home/BrandFilter";
import HomeBanner from "@/components/home/HomeBanner";
import ProductSection from "@/components/home/ProductSection";
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
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "2",
    name: "CLASSIC LEATHER",
    brand: "REEBOK",
    price: 99.6,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "3",
    name: "SUPERSTAR",
    brand: "ADIDAS",
    price: 89.9,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "4",
    name: "AIR MAX 95",
    brand: "NIKE",
    price: 139.9,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
];

const POPULAR_PRODUCTS = [
  {
    id: "5",
    name: "AIR JORDAN 1",
    brand: "NIKE",
    price: 169.9,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "6",
    name: "ULTRABOOST",
    brand: "ADIDAS",
    price: 159.9,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "7",
    name: "CLUB C 85",
    brand: "REEBOK",
    price: 79.9,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "8",
    name: "OLD SKOOL",
    brand: "VANS",
    price: 69.9,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
];

const NEWEST_PRODUCTS = [
  {
    id: "9",
    name: "ZOOM FLY 5",
    brand: "NIKE",
    price: 189.9,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "10",
    name: "NMD_R1",
    brand: "ADIDAS",
    price: 149.9,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "11",
    name: "SUEDE CLASSIC",
    brand: "PUMA",
    price: 89.9,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "12",
    name: "SK8-HI",
    brand: "VANS",
    price: 74.9,
    image:
      "https://plus.unsplash.com/premium_photo-1764180637275-cae8e42428c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
];

const BRANDS = [
  { name: "ALL", logo: null },
  {
    name: "NIKE",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/nike-4-logo-png-transparent.png",
  },
  {
    name: "ADIDAS",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/adidas-logo-png-transparent.png",
  },
  {
    name: "PUMA",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/puma-logo-png-transparent.png",
  },
  {
    name: "REEBOK",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/reebok-logo-png-transparent.png",
  },
  {
    name: "VANS",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/vans-logo-png-transparent.png",
  },
];

export default function HomeScreen() {
  const [selectedBrand, setSelectedBrand] = React.useState("ALL");

  return (
    <View className="flex-1 bg-gray-100 mt-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://cdn.dribbble.com/userupload/31584578/file/original-050b602625e120a96798e483b9199f46.png?format=webp&resize=450x338&vertical=center",
              }}
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
        <HomeBanner />

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
        <BrandFilter
          brands={BRANDS}
          selectedBrand={selectedBrand}
          onBrandSelect={setSelectedBrand}
        />

        {/* Product Sections */}
        <ProductSection title="For you" products={FOR_YOU_PRODUCTS} />
        <ProductSection title="Popular" products={POPULAR_PRODUCTS} />
        <ProductSection title="Newest" products={NEWEST_PRODUCTS} />
      </ScrollView>
    </View>
  );
}
