import "@/global.css";
import { styled } from "nativewind";
import { View } from "react-native";
import { SafeAreaView as RNSafeAreView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreView);

export default function App() {
  return (
    <SafeAreaView
      className="flex-1 bg-background p-5"
      style={{ padding: "auto" }}
    >
      <View className="home-header">
        <View className="home-user"></View>
      </View>
    </SafeAreaView>
  );
}
