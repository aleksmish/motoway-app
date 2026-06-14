import { addIcon, profileSettingsIcon } from "@/constants/data";
import images from "@/constants/images";
import { Image } from "expo-image";
import { styled } from "nativewind";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreView } from "react-native-safe-area-context";

const VEHICLES = [
  {
    id: 1,
    brand: "Kawasaki",
    model: "Ninja 650",
    modelYear: 2006,
    cc: 649,
    mileage: 15000,
    image:
      "https://content2.kawasaki.com/ContentStorage/KMC/ProductTrimGroup/18/0d00b2e1-35c8-456d-93b6-c7e22cd914bb.jpg?w=1500",
  },
  {
    id: 2,
    brand: "Kawasaki",
    model: "Ninja 650",
    modelYear: 2006,
    cc: 649,
    mileage: 15000,
    image:
      "https://content2.kawasaki.com/ContentStorage/KMC/ProductTrimGroup/18/0d00b2e1-35c8-456d-93b6-c7e22cd914bb.jpg?w=1500",
  },
  {
    id: 3,
    brand: "Kawasaki",
    model: "Ninja 650",
    modelYear: 2006,
    cc: 649,
    mileage: 15000,
    image:
      "https://content2.kawasaki.com/ContentStorage/KMC/ProductTrimGroup/18/0d00b2e1-35c8-456d-93b6-c7e22cd914bb.jpg?w=1500",
  },
];

const SafeAreaView = styled(RNSafeAreView);

const Profile = () => {
  return (
    <SafeAreaView
      className="flex-1 bg-background p-5"
      style={{ padding: "auto" }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="profile-header">
          <View className="profile-user">
            <Image
              resizeMode="contain"
              source={images.avatar}
              className="profile-avatar"
            />
            <View className="profile-info">
              <Text className="profile-user-name">Robin Banks</Text>
              <Text>Moscow, Russia</Text>
              <View>
                <Text>
                  <Text>0</Text> Friends
                </Text>
              </View>
            </View>
            <Pressable
              style={({ pressed }) => pressed && { opacity: 0.6 }}
              className="profile-settings__container"
            >
              <Image
                className="profile-settings"
                source={profileSettingsIcon}
              />
            </Pressable>
          </View>
        </View>
        <View className="profile-stats ">
          <View className="profile-sessions">
            <Text className="profile-stats__text-bold">0</Text>
            <Text className="profile-stats__text">Sessions</Text>
          </View>
          <View className="profile-miles">
            <Text className="profile-stats__text-bold">0 miles</Text>
            <Text className="profile-stats__text">Total distance</Text>
          </View>
          <View className="profile-duration">
            <Text className="profile-stats__text-bold">0 min</Text>
            <Text className="profile-stats__text">Duration</Text>
          </View>
        </View>
        <View className="profile-garage">
          <Text className="profile-garage__title">My Garage</Text>
          <View className="profile-garage__vehicles">
            <ScrollView
              contentContainerStyle={{ gap: 26 }}
              showsHorizontalScrollIndicator={false}
              className="profile-garage__vehicles-scroll"
              horizontal={true}
            >
              {VEHICLES.length > 0 ? (
                VEHICLES.map((vehicle) => (
                  <View className="profile-garage__vehicle" key={vehicle.id}>
                    <View className="profile-garage__vehicle-image-container">
                      <Image
                        resizeMode="contain"
                        className="profile-garage__vehicle-image"
                        source={{ uri: vehicle.image }}
                      />
                    </View>
                    <View className="profile-garage__vehicle-summary">
                      <Text className="profile-garage__vehicle-brand-model">
                        {vehicle.brand}, <Text>{vehicle.model}</Text>
                      </Text>
                      <Text>{vehicle.modelYear}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Pressable style={({ pressed }) => pressed && { opacity: 0.6 }}>
                  <View className="profile-garage__vehicle-empty">
                    <Image
                      className="profile-garage__vehicle-empty-add"
                      source={addIcon}
                    />
                    <Text>Add vehicle</Text>
                  </View>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
