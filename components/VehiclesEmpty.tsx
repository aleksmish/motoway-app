import { addIcon } from "@/constants/data";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const VehiclesEmpty = () => {
  return (
    <Pressable className="profile-garage__vehicle-empty-pressable">
      <View className="profile-garage__vehicle-empty">
        <Image className="profile-garage__vehicle-empty-add" source={addIcon} />
        <Text>Add vehicle</Text>
      </View>
    </Pressable>
  );
};

export default VehiclesEmpty;
