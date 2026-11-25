import { useFriendsStore } from "@/store/useFriendsStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function RiderProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    friends,
    requests,
    discoverRiders,
    acceptRequest,
    addFriendFromDiscover,
    removeFriend,
    setInvitedCompanion,
  } = useFriendsStore();

  const isFriend = friends.some((r) => r.id === id);
  const isRequest = requests.some((r) => r.id === id);

  const rider =
    friends.find((r) => r.id === id) ||
    requests.find((r) => r.id === id) ||
    discoverRiders.find((r) => r.id === id);

  if (!rider) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-5">
        <Text className="font-sans-bold text-lg text-primary">
          Райдер не найден
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 rounded-2xl bg-accent px-5 py-3"
        >
          <Text className="font-sans-bold text-sm text-primary">Назад</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleInviteToRide = () => {
    setInvitedCompanion(rider);
    router.push("/(tabs)/map");
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <View className="mb-4 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="rounded-full border border-border bg-card px-4 py-2 active:opacity-70"
          >
            <Text className="font-sans-bold text-sm text-primary">← Назад</Text>
          </Pressable>

          {rider.isRiding && (
            <View className="flex-row items-center gap-1.5 rounded-full bg-success/15 px-3 py-1">
              <View className="size-2 rounded-full bg-success" />
              <Text className="font-sans-semibold text-xs text-success">
                Сейчас в пути
              </Text>
            </View>
          )}
        </View>

        {/* Rider Header */}
        <View className="flex-row items-center gap-4">
          <Image
            source={{ uri: rider.avatar }}
            className="size-20 rounded-full bg-muted"
          />
          <View className="flex-1">
            <Text className="font-sans-bold text-2xl text-primary">
              {rider.name}
            </Text>
            <Text className="mt-0.5 font-sans-medium text-sm text-muted-foreground">
              {rider.city}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-4 flex-row gap-2.5">
          {isFriend ? (
            <Pressable
              onPress={() => removeFriend(rider.id)}
              className="flex-1 items-center rounded-2xl border border-destructive bg-card py-3.5 active:opacity-75"
            >
              <Text className="font-sans-bold text-sm text-destructive">
                Удалить из друзей
              </Text>
            </Pressable>
          ) : isRequest ? (
            <Pressable
              onPress={() => acceptRequest(rider.id)}
              className="flex-1 items-center rounded-2xl bg-accent py-3.5 active:opacity-75"
            >
              <Text className="font-sans-bold text-sm text-primary">
                Принять заявку в друзья
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => addFriendFromDiscover(rider.id)}
              className="flex-1 items-center rounded-2xl bg-accent py-3.5 active:opacity-75"
            >
              <Text className="font-sans-bold text-sm text-primary">
                + Добавить в друзья
              </Text>
            </Pressable>
          )}
        </View>

        {/* Stats Banner */}
        <View className="my-5 flex-row items-center justify-around rounded-2xl bg-primary py-3.5">
          <View className="items-center">
            <Text className="font-sans-bold text-xl text-white">
              {rider.ridesCount}
            </Text>
            <Text className="text-xs text-white/75">Поездок</Text>
          </View>
          <View className="items-center">
            <Text className="font-sans-bold text-xl text-white">
              {rider.seasonDistance}
            </Text>
            <Text className="text-xs text-white/75">За сезон</Text>
          </View>
        </View>

        {/* Rider's Bike */}
        <Text className="mb-2 font-sans-bold text-lg text-primary">
          Мотоцикл райдера
        </Text>
        <View className="rounded-2xl border border-border bg-card p-4">
          <Text className="font-sans-bold text-base text-primary">
            {rider.bike}
          </Text>
          <Text className="mt-1 font-sans-medium text-xs text-muted-foreground">
            Основной байк в гараже
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
