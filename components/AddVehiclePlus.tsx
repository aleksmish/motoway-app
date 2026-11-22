import { addIcon } from "@/constants/data";
import React, { useState } from "react";
import { Image, Pressable } from "react-native";
import AddMotorcycleModal from "./AddMotorcycleModal";

const AddVehiclePlus = ({ onAddVehicle }: VehiclesEmptyProps) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const openModal = () => {
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Pressable className="profile-garage__add-container" onPress={openModal}>
      <Image
        source={addIcon}
        className="profile-garage__add"
        resizeMode="contain"
      />
      <>
        <AddMotorcycleModal
          visible={isModalVisible}
          onClose={closeModal}
          onAddVehicle={onAddVehicle}
        />
      </>
    </Pressable>
  );
};

export default AddVehiclePlus;
