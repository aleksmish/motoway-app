import VehicleCard from "@/components/VehicleCard";
import VehiclesEmpty from "@/components/VehiclesEmpty";
import { profileSettingsIcon } from "@/constants/data";
import images from "@/constants/images";
import { useGarageStore } from "@/store/useGarageStore";
import { getCompletedStats, useRouteStore } from "@/store/useRouteStore";
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

const SafeAreaView = styled(RNSafeAreView);

const Profile = () => {
  const { vehicles, addVehicle } = useGarageStore();
  const { routes } = useRouteStore();
  const handleAddVehicle = (vehicle: Vehicle) => {
    addVehicle(vehicle);
  };
  const { totalRides, totalDistanceKm, totalDuration } =
    getCompletedStats(routes);
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
              <Text className="profile-user-name">Александр Иванов</Text>
              <Text>Москва, Россия</Text>
              <View>
                <Text>
                  <Text>0</Text> Друзей
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
            <Text className="profile-stats__text-bold">{totalRides}</Text>
            <Text className="profile-stats__text">Поездок</Text>
          </View>
          <View className="profile-miles">
            <Text className="profile-stats__text-bold">{totalDistanceKm}</Text>
            <Text className="profile-stats__text">Дистанция</Text>
          </View>
          <View className="profile-duration">
            <Text className="profile-stats__text-bold">{totalDuration}</Text>
            <Text className="profile-stats__text">Время</Text>
          </View>
        </View>
        <View className="profile-garage">
          <Text className="profile-garage__title">Мой гараж</Text>
          <View className="profile-garage__vehicles">
            <FlatList
              data={vehicles}
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
                width: vehicles.length > 0 ? "auto" : "100%",
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
