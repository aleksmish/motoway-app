import { addIcon } from "@/constants/data";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import AddMotorcycleModal from "./AddMotorcycleModal";

const VehiclesEmpty = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const openModal = () => {
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Pressable
      className="profile-garage__vehicle-empty-pressable"
      onPress={openModal}
    >
      <View className="profile-garage__vehicle-empty">
        <Image className="profile-garage__vehicle-empty-add" source={addIcon} />
        <Text>Add vehicle</Text>
      </View>
      <>
        <AddMotorcycleModal visible={isModalVisible} onClose={closeModal} />
      </>
    </Pressable>
  );
};

export default VehiclesEmpty;
