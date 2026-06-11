import { profileSettingsIcon } from "@/constants/data";
import images from "@/constants/images";
import { Image } from "expo-image";
import { styled } from "nativewind";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreView);

const Profile = () => {
  return (
    <SafeAreaView
      className="flex-1 bg-background p-5"
      style={{ padding: "auto" }}
    >
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
          <Image source={profileSettingsIcon} className="profile-settings" />
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
    </SafeAreaView>
  );
};

export default Profile;
