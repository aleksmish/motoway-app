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
    brand: "Kawasaki",
    model: "Ninja 650",
    modelYear: 2006,
    cc: 649,
    mileAge: 15000,
    image:
      "https://content2.kawasaki.com/ContentStorage/KMC/ProductTrimGroup/18/0d00b2e1-35c8-456d-93b6-c7e22cd914bb.jpg?w=1500",
  },
  {
    id: "2",
    brand: "Kawasaki",
    model: "Ninja 650",
    modelYear: 2006,
    cc: 649,
    mileAge: 15000,
    image:
      "https://content2.kawasaki.com/ContentStorage/KMC/ProductTrimGroup/18/0d00b2e1-35c8-456d-93b6-c7e22cd914bb.jpg?w=1500",
  },
  {
    id: "3",
    brand: "Kawasaki",
    model: "Ninja 650",
    modelYear: 2006,
    cc: 649,
    mileAge: 15000,
    image:
      "https://content2.kawasaki.com/ContentStorage/KMC/ProductTrimGroup/18/0d00b2e1-35c8-456d-93b6-c7e22cd914bb.jpg?w=1500",
  },
];

const SafeAreaView = styled(RNSafeAreView);

const Profile = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
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
            <FlatList
              data={VEHICLES}
              showsHorizontalScrollIndicator={false}
              className="profile-garage__vehicles-scroll"
              horizontal
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <VehicleCard {...item} />}
              ListEmptyComponent={VehiclesEmpty}
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
