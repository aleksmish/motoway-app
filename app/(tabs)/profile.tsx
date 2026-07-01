import VehicleCard from "@/components/VehicleCard";
import VehiclesEmpty from "@/components/VehiclesEmpty";
import { profileSettingsIcon } from "@/constants/data";
import images from "@/constants/images";
import { styled } from "nativewind";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreView } from "react-native-safe-area-context";

const VEHICLES = [
  {
    id: "1",
    image:
      "https://content2.kawasaki.com/ContentStorage/KMC/ProductTrimGroup/18/0d00b2e1-35c8-456d-93b6-c7e22cd914bb.jpg?w=1500",
    name: "Kawasaki Ninja ZX-10R",
    make: "Kawasaki Heavy Industries",
    horsepower: 203,
    model: "Ninja ZX-10R",
    yearBuilt: 2025,
    color: "Black",
  },
  {
    id: "2",
    image:
      "https://content2.kawasaki.com/ContentStorage/KMC/ProductTrimGroup/18/0d00b2e1-35c8-456d-93b6-c7e22cd914bb.jpg?w=1500",
    name: "Kawasaki Ninja ZX-10R",
    make: "Kawasaki Heavy Industries",
    horsepower: 203,
    model: "Ninja ZX-10R",
    color: "Black",
    yearBuilt: 2025,
  },
  {
    id: "3",
    image:
      "https://content2.kawasaki.com/ContentStorage/KMC/ProductTrimGroup/18/0d00b2e1-35c8-456d-93b6-c7e22cd914bb.jpg?w=1500",
    name: "Kawasaki Ninja ZX-10R",
    make: "Kawasaki Heavy Industries",
    horsepower: 203,
    model: "Ninja ZX-10R",
    color: "Black",
    yearBuilt: 2025,
  },
];

const SafeAreaView = styled(RNSafeAreView);

const Profile = () => {
  const handleAddVehicle = (vehicle: Vehicle) => {
    VEHICLES.push(vehicle);
  };
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="profile-header">
          <Image
            resizeMode="contain"
            source={images.avatar}
            className="profile-avatar"
          />
          <View className="profile-sub-header">
            <View className="profile-info">
              <Text className="profile-user-name">Robin Banks</Text>
              <Text>Moscow, Russia</Text>
              <View>
                <Text>
                  <Text>0</Text> Friends
                </Text>
              </View>
            </View>
            <Pressable className="profile-settings-container">
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
          <VehiclesEmpty onAddVehicle={handleAddVehicle} />
          <View className="profile-garage__vehicles">
            <FlatList
              data={VEHICLES}
              showsHorizontalScrollIndicator={false}
              className="profile-garage__vehicles-scroll"
              horizontal
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <VehicleCard {...item} />}
              ListEmptyComponent={
                <>
                  <VehiclesEmpty onAddVehicle={handleAddVehicle} />
                </>
              }
              contentContainerStyle={{
                gap: 26,
                width: VEHICLES.length > 0 ? "auto" : "100%",
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
