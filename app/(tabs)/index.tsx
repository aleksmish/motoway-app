import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreView);

export default function App() {
  return (
    <SafeAreaView
      className="flex-1 bg-background p-5"
      style={{ padding: "auto" }}
    >
      <Text className="text-3xl font-sans-extrabold">Home</Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded bg-blue-800 font-sans-bold text-white p-4"
      >
        Go to Onboarding
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-blue-800 font-sans-bold text-white p-4"
      >
        Go to Sign In
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded bg-blue-800 font-sans-bold text-white p-4"
      >
        Go to Sign Up
      </Link>
    </SafeAreaView>
  );
}
