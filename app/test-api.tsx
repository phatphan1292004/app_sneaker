import { brandService } from '@/services/brand_service';
import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';

export default function TestAPIScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testGetBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      console.log('🔄 Testing API...');
      const data = await brandService.getAllBrands();
      
      console.log('✅ Success! Data:', data);
      setResult(data);
      Alert.alert('Thành công!', `Lấy được ${data.length} brands từ backend`);
    } catch (err: any) {
      console.error('❌ Error:', err);
      const errorMsg = err.message || 'Unknown error';
      setError(errorMsg);
      Alert.alert('Lỗi', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-4">🧪 Test API Connection</Text>
      
      <View className="mb-4 p-4 bg-gray-100 rounded-lg">
        <Text className="font-semibold mb-2">Backend URL:</Text>
        <Text className="text-sm text-gray-600">{process.env.EXPO_PUBLIC_API_BASE_URL}</Text>
      </View>

      <TouchableOpacity
        onPress={testGetBrands}
        disabled={loading}
        className="p-4 rounded-lg mb-4"
        style={{ backgroundColor: loading ? '#ccc' : '#496c60' }}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? 'Testing...' : '🚀 Test GET Brands'}
        </Text>
      </TouchableOpacity>

      {loading && (
        <View className="items-center py-4">
          <ActivityIndicator size="large" color="#496c60" />
          <Text className="text-gray-600 mt-2">Đang kết nối đến backend...</Text>
        </View>
      )}

      {error && (
        <View className="p-4 bg-red-100 rounded-lg mb-4">
          <Text className="text-red-800 font-semibold mb-2">❌ Error:</Text>
          <Text className="text-red-600">{error}</Text>
        </View>
      )}

      {result && (
        <View className="p-4 bg-green-100 rounded-lg">
          <Text className="text-green-800 font-semibold mb-2">✅ Success!</Text>
          <Text className="text-green-700 mb-2">Số brands: {result.length}</Text>
          <ScrollView className="max-h-64">
            <Text className="text-xs text-gray-700">
              {JSON.stringify(result, null, 2)}
            </Text>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}
