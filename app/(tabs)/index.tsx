import baseMotoImage from "@/assets/images/base-moto.png";
import images from "@/constants/images";
import "@/global.css";
import { useGarageStore } from "@/store/useGarageStore";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const RECENT_ACTIVITY = [
  {
    id: "1",
    rider: "Дмитрий Соколов",
    bike: "Kawasaki Ninja 650",
    route: "Зеленоград — Сергиев Посад",
    distance: "88 км",
    curves: 74,
    timeAgo: "2 часа назад",
    avatar: "https://pravatar.cc",
  },
  {
    id: "2",
    rider: "Артём Волков",
    bike: "BMW R 1250 GS",
    route: "Дмитровские холмы и Яхрома",
    distance: "114 км",
    curves: 118,
    timeAgo: "Вчера",
    avatar: "https://pravatar.cc",
  },
];

export default function App() {
  const router = useRouter();
  const { vehicles, activeVehicleId } = useGarageStore();
  const activeVehicle =
    vehicles.find((v) => String(v.id) === String(activeVehicleId)) ??
    vehicles[0];

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Шапка с профилем и погодой */}
        <View className="mb-5 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            className="flex-row items-center gap-3 active:opacity-75"
          >
            <Image
              source={images.avatar}
              className="size-12 rounded-full bg-muted"
            />
            <View>
              <Text className="font-sans-medium text-xs text-muted-foreground">
                Привет, райдер
              </Text>
              <Text className="font-sans-bold text-lg text-primary">
                Александр Иванов
              </Text>
            </View>
          </Pressable>

          <View className="items-end rounded-2xl border border-border bg-card px-3 py-2">
            <Text className="font-sans-bold text-sm text-primary">
              +18°C ☀️
            </Text>
            <Text className="font-sans-medium text-xs text-success">
              Сухой асфальт
            </Text>
          </View>
        </View>

        {/* Главный баннер быстрого старта поездки */}
        <View className="mb-5 rounded-3xl bg-primary p-5">
          <View className="mb-1 flex-row items-center gap-2">
            <View className="size-2 rounded-full bg-accent" />
            <Text className="font-sans-semibold text-xs uppercase tracking-[1px] text-white/70">
              Готов к выезду
            </Text>
          </View>

          <Text className="mt-1 font-sans-bold text-2xl text-white">
            Записать новый маршрут
          </Text>
          <Text className="mt-1 font-sans-medium text-xs text-white/75">
            Выбирай извилистые дороги, отслеживай виражи и делись треком с
            друзьями.
          </Text>

          <View className="mt-4 flex-row gap-2.5">
            <Pressable
              onPress={() => router.push("/(tabs)/map")}
              className="flex-1 items-center rounded-2xl bg-accent py-3.5 active:opacity-75"
            >
              <Text className="font-sans-bold text-sm text-primary">
                Открыть карту
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(tabs)/routes")}
              className="items-center justify-center rounded-2xl border border-white/20 px-4 py-3.5 active:opacity-75"
            >
              <Text className="font-sans-bold text-sm text-white">
                Маршруты
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Карточка активного мотоцикла */}
        <View className="mb-5">
          <View className="mb-2.5 flex-row items-center justify-between">
            <Text className="font-sans-bold text-lg text-primary">
              Активный байк
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/profile")}>
              <Text className="font-sans-semibold text-xs text-accent">
                Весь гараж →
              </Text>
            </Pressable>
          </View>

          {activeVehicle ? (
            <Pressable
              onPress={() => router.push("/(tabs)/profile")}
              className="flex-row items-center justify-between rounded-2xl border border-border bg-card p-3.5 active:opacity-80"
            >
              <View className="flex-1 flex-row items-center gap-3">
                <Image
                  source={
                    activeVehicle.image
                      ? { uri: activeVehicle.image }
                      : baseMotoImage
                  }
                  className="h-16 w-20 rounded-xl bg-muted"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text
                    className="font-sans-bold text-base text-primary"
                    numberOfLines={1}
                  >
                    {activeVehicle.name}
                  </Text>
                  <Text className="mt-0.5 font-sans-medium text-xs text-muted-foreground">
                    {activeVehicle.yearBuilt} • {activeVehicle.horsepower} л.с.
                    • {activeVehicle.color}
                  </Text>
                </View>
              </View>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push("/(tabs)/profile")}
              className="items-center rounded-2xl border border-dashed border-border bg-card p-4 active:opacity-75"
            >
              <Text className="font-sans-semibold text-sm text-muted-foreground">
                + Добавить мотоцикл в гараж
              </Text>
            </Pressable>
          )}
        </View>

        {/* Лента поездок друзей */}
        <View>
          <View className="mb-2.5 flex-row items-center justify-between">
            <Text className="font-sans-bold text-lg text-primary">
              Лента райдеров
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/friends")}>
              <Text className="font-sans-semibold text-xs text-accent">
                Друзья →
              </Text>
            </Pressable>
          </View>

          {RECENT_ACTIVITY.map((item) => (
            <View
              key={item.id}
              className="mb-3 rounded-2xl border border-border bg-card p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5">
                  <Image
                    source={{ uri: item.avatar }}
                    className="size-10 rounded-full bg-muted"
                  />
                  <View>
                    <Text className="font-sans-bold text-sm text-primary">
                      {item.rider}
                    </Text>
                    <Text className="font-sans-medium text-xs text-muted-foreground">
                      {item.bike} • {item.timeAgo}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mt-3 rounded-xl bg-muted p-3">
                <Text className="font-sans-bold text-sm text-primary">
                  {item.route}
                </Text>
                <Text className="mt-1 font-sans-semibold text-xs text-accent">
                  {item.distance} • {item.curves} виражей
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
