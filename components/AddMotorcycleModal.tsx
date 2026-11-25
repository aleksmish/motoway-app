import { photoCamera } from "@/constants/data";
import * as ImagePicker from "expo-image-picker";
import { styled } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreView);

export default function AddMotorcycleModal({
  visible,
  onClose,
  onAddVehicle,
  initialVehicle,
  onDeleteVehicle,
}: AddMotorcycleModalProps) {
  const [selectedImage, setSelectedImage] = useState("");
  const [name, setName] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [horsepower, setHorsepower] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (visible && initialVehicle) {
      setName(initialVehicle.name || "");
      setMake(initialVehicle.make || "");
      setModel(initialVehicle.model || "");
      setHorsepower(String(initialVehicle.horsepower || ""));
      setYearBuilt(String(initialVehicle.yearBuilt || ""));
      setColor(initialVehicle.color || "");
      setSelectedImage(initialVehicle.image || "");
    } else {
      resetForm();
    }
  }, [visible, initialVehicle]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isValidInteger = (value: string | number) => {
    const str = String(value).trim();
    if (str === "") return false;

    const num = Number(str);
    return Number.isInteger(num);
  };

  const isValidForm = () => {
    if (!isValidInteger(horsepower)) {
      alert("Horsepower should be an integer");
      return false;
    }
    if (!isValidInteger(yearBuilt)) {
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
    if (!isValidForm()) return;

    const vehicle: Vehicle = {
      id: initialVehicle ? initialVehicle.id : `${Date.now()}`,
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
    } else {
      alert("You did not select any image");
    }
  };

  const handleDelete = () => {
    if (!initialVehicle || !onDeleteVehicle) return;

    Alert.alert(
      "Удалить транспорт",
      `Удалить ${initialVehicle.make} ${initialVehicle.model} из гаража?`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: () => {
            onDeleteVehicle(initialVehicle.id);
            handleClose();
          },
        },
      ],
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView
          className="w-full h-full"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback
            className="flex-1"
            onPress={Keyboard.dismiss}
          >
            <Pressable className="modal-container">
              <View className="modal-header">
                <Pressable className="modal-close" onPress={handleClose}>
                  <Text className="modal-close-text">✕</Text>
                </Pressable>
                <Text className="modal-title">
                  {initialVehicle
                    ? "Редактировать транспорт"
                    : "Добавить транспорт"}
                </Text>
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
                      <Text className="modal-add-photo-text">
                        Добавить фотографию
                      </Text>
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={pickImageAsync}
                    className="modal-image-container"
                  >
                    <Image
                      source={{ uri: selectedImage }}
                      resizeMode="contain"
                      className="modal-image"
                    />
                  </Pressable>
                )}
                <View className="auth-field">
                  <TextInput
                    className="auth-input"
                    placeholder="Имя"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setName}
                    value={name}
                  />
                </View>
                <View className="auth-field">
                  <TextInput
                    className="auth-input"
                    placeholder="Марка"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setMake}
                    value={make}
                  />
                </View>
                <View className="auth-field">
                  <TextInput
                    className="auth-input"
                    placeholder="Модель"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setModel}
                    value={model}
                  />
                </View>
                <View className="auth-field">
                  <TextInput
                    keyboardType="numeric"
                    className="auth-input"
                    placeholder="Мощность двигателя"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={(val) => setHorsepower(val)}
                    value={horsepower}
                  />
                </View>
                <View className="auth-field">
                  <TextInput
                    keyboardType="numeric"
                    className="auth-input"
                    placeholder="Год выпуска"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={(val) => setYearBuilt(val)}
                    value={yearBuilt}
                  />
                </View>
                <View className="auth-field">
                  <TextInput
                    className="auth-input"
                    placeholder="Цвет"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setColor}
                    value={color}
                  />
                </View>
                <Pressable
                  className="auth-button"
                  onPress={() => handleSubmit()}
                >
                  <Text className="auth-button-text">
                    {initialVehicle ? "Сохранить" : "Добавить транспорт"}
                  </Text>
                </Pressable>
                {initialVehicle && onDeleteVehicle && (
                  <Pressable
                    className="auth-delete-button"
                    onPress={handleDelete}
                  >
                    <Text className="auth-delete-button-text">
                      Удалить транспорт
                    </Text>
                  </Pressable>
                )}
              </ScrollView>
            </Pressable>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
