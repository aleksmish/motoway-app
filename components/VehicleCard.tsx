import React from "react";
import { Image, Text, View } from "react-native";

const VehicleCard = ({ id, image, brand, model, modelYear }: Vehicle) => {
  return (
    <View className="profile-garage__vehicle" key={id}>
      <View className="profile-garage__vehicle-image-container">
        <Image
          resizeMode="contain"
          className="profile-garage__vehicle-image"
          source={{ uri: image }}
        />
      </View>
      <View className="profile-garage__vehicle-summary">
        <Text className="profile-garage__vehicle-brand-model">
          {brand}, <Text>{model}</Text>
        </Text>
        <Text>{modelYear}</Text>
      </View>
    </View>
  );
};

export default VehicleCard;
