import { Redirect } from 'expo-router';

export default function Index() {
    // Redirect to tabs (user interface) by default
    return <Redirect href="/(tabs)" />;
}
