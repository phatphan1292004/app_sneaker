import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  discount?: number;
}

interface SearchSuggestionsProps {
  results: Product[];
  loading: boolean;
  onSelectProduct: (productId: string) => void;
  onSeeAll: () => void;
}

export default function SearchSuggestions({
  results,
  loading,
  onSelectProduct,
  onSeeAll,
}: SearchSuggestionsProps) {
  if (loading) {
    return (
      <View className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg p-4" style={{ zIndex: 9999 }}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  if (results.length === 0) {
    return null;
  }

  const displayResults = results.slice(0, 5);

  return (
    <View className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden" style={{ zIndex: 9999 }}>
      {displayResults.map((product) => (
        <TouchableOpacity
          key={product.id}
          onPress={() => onSelectProduct(product.id)}
          className="flex-row items-center p-3 border-b border-gray-100"
        >
          <Image
            source={{ uri: product.image }}
            className="w-12 h-12 rounded-lg"
          />
          <View className="flex-1 ml-3">
            <Text className="text-sm font-medium text-gray-900 mb-1" numberOfLines={1}>
              {product.name}
            </Text>
            <Text className="text-xs text-gray-500">{product.brand}</Text>
          </View>
          <View className="items-end">
            {product.discount && product.discount > 0 ? (
              <>
                <Text className="text-sm font-semibold text-gray-900">
                  {(product.price * (1 - product.discount / 100)).toLocaleString("vi-VN")} đ
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-xs text-gray-400 line-through mr-1">
                    {product.price.toLocaleString("vi-VN")} đ
                  </Text>
                  <Text className="text-xs font-semibold text-green-600">
                    -{product.discount}%
                  </Text>
                </View>
              </>
            ) : (
              <Text className="text-sm font-semibold text-gray-900">
                {product.price.toLocaleString("vi-VN")} đ
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
      
      {results.length > 5 && (
        <TouchableOpacity
          onPress={onSeeAll}
          className="p-3 bg-gray-50"
        >
          <Text className="text-sm font-medium text-blue-600 text-center">
            See all {results.length} results
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
