import { addIcon } from "@/constants/data";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

const VehiclesEmpty = () => {
  return (
    <Pressable
      className="profile-garage__vehicle-empty-pressable"
      style={({ pressed }) => pressed && { opacity: 0.6 }}
    >
      <View className="profile-garage__vehicle-empty">
        <Image className="profile-garage__vehicle-empty-add" source={addIcon} />
        <Text>Add vehicle</Text>
      </View>
    </Pressable>
  );
};

export default VehiclesEmpty;
