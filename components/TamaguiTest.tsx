import { Text, View } from 'react-native';

export default function TamaguiTest() {
  return (
    <View className="bg-blue-500 p-4 rounded-xl items-center">
      <Text className="text-white text-xl font-bold mb-2">NativeWind Tailwind Test</Text>
      <View className="bg-white px-4 py-2 rounded-lg">
        <Text className="text-blue-500">Nút styled bằng NativeWind</Text>
      </View>
    </View>
  );
}