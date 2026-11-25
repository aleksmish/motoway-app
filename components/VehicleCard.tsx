import { useGarageStore } from "@/store/useGarageStore";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import baseMotoImage from "../assets/images/base-moto.png";
import AddMotorcycleModal from "./AddMotorcycleModal";

const VehicleCard = (vehicle: Vehicle) => {
  const { id, image, make, model, yearBuilt } = vehicle;
  const { updateVehicle } = useGarageStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <Pressable
      className="profile-garage__vehicle"
      key={id}
      onPress={() => setIsModalVisible(true)}
    >
      <View className="profile-garage__vehicle-image-container">
        <Image
          resizeMode="contain"
          className="profile-garage__vehicle-image"
          source={image ? { uri: image } : baseMotoImage}
        />
      </View>
      <View className="profile-garage__vehicle-summary">
        <Text className="profile-garage__vehicle-brand-model">
          {make}, <Text>{model}</Text>
        </Text>
        <Text>{yearBuilt}</Text>
      </View>
      <AddMotorcycleModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddVehicle={updateVehicle}
        initialVehicle={vehicle}
      />
    </Pressable>
  );
};

export default VehicleCard;
