import { useFriendsStore } from "@/store/useFriendsStore";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export interface Friend {
  id: string;
  name: string;
  city: string;
  bike: string;
  seasonDistance: string;
  ridesCount: number;
  isRiding: boolean;
  avatar: string;
}

const Friends = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const { friends, requests, acceptRequest } = useFriendsStore();

  const handleAcceptRequest = (user: Friend) => {
    acceptRequest(user.id);
  };

  const handleInviteToRide = (friend: Friend) => {
    router.push({
      pathname: "/(tabs)/map",
      params: { inviteFriendId: friend.id, friendName: friend.name },
    });
  };

  const currentList = (activeTab === "friends" ? friends : requests).filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bike.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderFriendCard = ({ item }: { item: Friend }) => (
    <Pressable
      onPress={() => router.push(`/friend/${item.id}` as any)}
      className="mb-3 flex-row items-center justify-between rounded-2xl border border-border bg-card p-4 active:opacity-80"
    >
      <View className="flex-1 flex-row items-center">
        <View className="relative">
          <Image
            source={{ uri: item.avatar }}
            className="size-14 rounded-full bg-muted"
          />
          {item.isRiding && (
            <View className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-card bg-success" />
          )}
        </View>

        <View className="ml-3.5 flex-1">
          <Text
            className="font-sans-bold text-base text-primary"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="mt-0.5 font-sans-medium text-xs text-muted-foreground">
            {item.city}
          </Text>

          <View className="mt-1.5 flex-row flex-wrap items-center gap-2">
            <View className="rounded-md border border-accent/25 bg-accent/15 px-2 py-0.5">
              <Text className="font-sans-semibold text-xs text-accent">
                🏍 {item.bike}
              </Text>
            </View>
            <Text className="font-sans-medium text-xs text-muted-foreground">
              • {item.seasonDistance}
            </Text>
          </View>
        </View>
      </View>

      {activeTab === "friends" ? (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            handleInviteToRide(item);
          }}
          className="ml-2 rounded-xl bg-accent px-3.5 py-2 active:opacity-70"
        >
          <Text className="font-sans-bold text-xs text-primary">
            На маршрут
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            handleAcceptRequest(item);
          }}
          className="ml-2 rounded-xl bg-subscription px-3.5 py-2 active:opacity-70"
        >
          <Text className="font-sans-bold text-xs text-primary">Принять</Text>
        </Pressable>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5 mb-5">
      {/* Заголовок */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="font-sans-bold text-2xl text-primary">Друзья</Text>
          <Text className="mt-0.5 font-sans-medium text-xs text-muted-foreground">
            {friends.filter((f) => f.isRiding).length} сейчас в пути
          </Text>
        </View>
      </View>

      {/* Поиск */}
      <View className="mb-4 flex-row items-center rounded-xl border border-border bg-card px-4 py-2.5">
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Имя райдера или модель мотоцикла..."
          placeholderTextColor="rgba(0, 0, 0, 0.45)"
          className="flex-1 font-sans-medium text-sm text-primary"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Text className="ml-2 font-sans-bold text-xs text-muted-foreground">
              ✕
            </Text>
          </Pressable>
        )}
      </View>

      {/* Вкладки */}
      <View className="mb-4 flex-row rounded-xl border border-border bg-muted p-1">
        <Pressable
          onPress={() => setActiveTab("friends")}
          className={`flex-1 items-center rounded-lg py-2 ${
            activeTab === "friends" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-sans-semibold text-xs ${
              activeTab === "friends"
                ? "text-background"
                : "text-muted-foreground"
            }`}
          >
            Мои друзья ({friends.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("requests")}
          className={`flex-1 items-center rounded-lg py-2 ${
            activeTab === "requests" ? "bg-primary" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-sans-semibold text-xs ${
              activeTab === "requests"
                ? "text-background"
                : "text-muted-foreground"
            }`}
          >
            Заявки ({requests.length})
          </Text>
        </Pressable>
      </View>

      {/* Список */}
      <FlatList
        data={currentList}
        keyExtractor={(item) => item.id}
        renderItem={renderFriendCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Text className="text-center font-sans-medium text-sm text-muted-foreground">
              {searchQuery
                ? "Райдеры по запросу не найдены"
                : "Список пока пуст"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Friends;
