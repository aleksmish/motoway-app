import { photoCamera } from "@/constants/data";
import * as ImagePicker from "expo-image-picker";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreView } from "react-native-safe-area-context";

export default function AddMotorcycleModal({
  visible,
  onClose,
  onAddVehicle,
}: AddMotorcycleModalProps) {
  const SafeAreaView = styled(RNSafeAreView);

  const [selectedImage, setSelectedImage] = useState("");
  const [name, setName] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [horsepower, setHorsepower] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [color, setColor] = useState("");

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isValidForm = () => {
    if (!Number.isInteger(horsepower)) {
      alert("Horsepower should be an integer");
      return false;
    }
    if (!Number.isInteger(yearBuilt)) {
      alert("Year built should be an integer");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setName("");
    setMake("");
    setModel("");
    setHorsepower("");
    setYearBuilt("");
    setColor("");
    setSelectedImage("");
  };

  const handleSubmit = () => {
    if (!isValidForm) return;

    const vehicle: Vehicle = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      make: make.trim(),
      model: model.trim(),
      horsepower: Number(horsepower),
      yearBuilt: Number(yearBuilt),
      color: color,
      image: selectedImage,
    };

    onAddVehicle(vehicle);
    handleClose();
  };

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: false,
      aspect: [318, 248],
      mediaTypes: ["images"],
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log(result);
    } else {
      alert("You did not select any image");
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-background">
        <Pressable
          className="modal-container"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="modal-header">
            <Pressable className="modal-close" onPress={handleClose}>
              <Text className="modal-close-text">✕</Text>
            </Pressable>
            <Text className="modal-title">Add Vehicle</Text>
          </View>
          <ScrollView
            className="p-5"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
          >
            {!selectedImage ? (
              <Pressable
                className="modal-add-photo-pressable"
                onPress={pickImageAsync}
              >
                <View className="modal-add-photo">
                  <Image
                    source={photoCamera}
                    className="modal-add-photo-image"
                  />
                  <Text className="modal-add-photo-text">Add photo</Text>
                </View>
              </Pressable>
            ) : (
              <View className="modal-image-container">
                <Image
                  source={{ uri: selectedImage }}
                  resizeMode="contain"
                  className="modal-image"
                />
              </View>
            )}
            <View className="auth-field">
              <TextInput
                className="auth-input"
                placeholder="Name"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                onChangeText={setName}
                value={name}
              />
            </View>
            <View className="auth-field">
              <TextInput
                className="auth-input"
                placeholder="Make"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                onChangeText={setMake}
                value={make}
              />
            </View>
            <View className="auth-field">
              <TextInput
                className="auth-input"
                placeholder="Model"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                onChangeText={setModel}
                value={model}
              />
            </View>
            <View className="auth-field">
              <TextInput
                keyboardType="numeric"
                className="auth-input"
                placeholder="Horsepower"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                onChangeText={(val) => setHorsepower(val)}
                value={horsepower}
              />
            </View>
            <View className="auth-field">
              <TextInput
                keyboardType="numeric"
                className="auth-input"
                placeholder="Year built"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                onChangeText={(val) => setYearBuilt(val)}
                value={yearBuilt}
              />
            </View>
            <View className="auth-field">
              <TextInput
                className="auth-input"
                placeholder="Color"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                onChangeText={setColor}
                value={color}
              />
            </View>
            <Pressable className="auth-button" onPress={() => handleSubmit()}>
              <Text className="auth-button-text">Add Vehicle</Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}
