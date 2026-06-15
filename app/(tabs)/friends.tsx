import { styled } from "nativewind";
import React from "react";
import { Text } from "react-native";

import { SafeAreaView as RNSafeAreView } from "react-native-safe-area-context";

const Friends = () => {
  const SafeAreaView = styled(RNSafeAreView);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>Friends</Text>
    </SafeAreaView>
  );
};

export default Friends;
