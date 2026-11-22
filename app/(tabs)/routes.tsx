import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

interface MotoRoute {
  id: string;
  title: string;
  region: string;
  distance: string;
  duration: string;
  curves: number;
  difficulty: "Лёгкий" | "Средний" | "Серпантин";
  isFavorite: boolean;
  isCompleted: boolean;
  author: string;
}

const INITIAL_ROUTES: MotoRoute[] = [
  {
    id: "1",
    title: "Зеленоград — Сергиев Посад",
    region: "Московская область",
    distance: "88 км",
    duration: "1 ч 24 мин",
    curves: 74,
    difficulty: "Средний",
    isFavorite: true,
    isCompleted: true,
    author: "Александр Иванов",
  },
  {
    id: "2",
    title: "Дмитровские холмы и Яхрома",
    region: "Север Подмосковья",
    distance: "114 км",
    duration: "1 ч 48 мин",
    curves: 118,
    difficulty: "Серпантин",
    isFavorite: true,
    isCompleted: false,
    author: "Дмитрий Соколов",
  },
  {
    id: "3",
    title: "Новорижский прохват до Истры",
    region: "Запад Подмосковья",
    distance: "62 км",
    duration: "49 мин",
    curves: 31,
    difficulty: "Лёгкий",
    isFavorite: false,
    isCompleted: true,
    author: "Артём Волков",
  },
  {
    id: "4",
    title: "Приокский серпантин • Таруса",
    region: "Калужская область",
    distance: "156 км",
    duration: "2 ч 30 мин",
    curves: 164,
    difficulty: "Серпантин",
    isFavorite: false,
    isCompleted: false,
    author: "Редакция MotoWay",
  },
];

const Routes = () => {
  const router = useRouter();
  const [routes, setRoutes] = useState<MotoRoute[]>(INITIAL_ROUTES);
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "history">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFavorite = (id: string) => {
    setRoutes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleOpenOnMap = (route: MotoRoute) => {
    router.push({
      pathname: "/(tabs)/map",
      params: { routeTitle: route.title },
    });
  };

  const filteredRoutes = routes.filter((item) => {
    if (activeTab === "favorites" && !item.isFavorite) return false;
    if (activeTab === "history" && !item.isCompleted) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.region.toLowerCase().includes(q)
    );
  });

  const tabs: { key: "all" | "favorites" | "history"; label: string }[] = [
    { key: "all", label: `Все (${routes.length})` },
    {
      key: "favorites",
      label: `Избранное (${routes.filter((r) => r.isFavorite).length})`,
    },
    {
      key: "history",
      label: `Пройдено (${routes.filter((r) => r.isCompleted).length})`,
    },
  ];

  const renderRouteCard = ({ item }: { item: MotoRoute }) => (
    <View className="mb-3 rounded-2xl border border-border bg-card p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <View className="mb-1 flex-row items-center gap-2">
            <View className="rounded-md bg-muted px-2 py-0.5">
              <Text className="font-sans-semibold text-xs text-primary">
                {item.difficulty}
              </Text>
            </View>
            {item.isCompleted && (
              <Text className="font-sans-semibold text-xs text-success">
                ✓ Пройден
              </Text>
            )}
          </View>

          <Text className="font-sans-bold text-lg text-primary">
            {item.title}
          </Text>
          <Text className="mt-0.5 font-sans-medium text-xs text-muted-foreground">
            {item.region} • Автор: {item.author}
          </Text>
        </View>

        <Pressable
          onPress={() => toggleFavorite(item.id)}
          className="size-9 items-center justify-center rounded-full border border-border bg-background active:opacity-70"
        >
          <Text
            className={`text-base ${
              item.isFavorite ? "text-accent" : "text-muted-foreground"
            }`}
          >
            {item.isFavorite ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      <View className="my-3 flex-row items-center justify-between rounded-xl bg-muted px-3.5 py-2.5">
        <View>
          <Text className="font-sans-bold text-sm text-primary">
            {item.distance}
          </Text>
          <Text className="font-sans-medium text-xs text-muted-foreground">
            Дистанция
          </Text>
        </View>

        <View>
          <Text className="font-sans-bold text-sm text-primary">
            {item.duration}
          </Text>
          <Text className="font-sans-medium text-xs text-muted-foreground">
            В пути
          </Text>
        </View>

        <View>
          <Text className="font-sans-bold text-sm text-accent">
            {item.curves} виражей
          </Text>
          <Text className="font-sans-medium text-xs text-muted-foreground">
            Извилистость
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => handleOpenOnMap(item)}
        className="items-center rounded-xl bg-accent py-3 active:opacity-75"
      >
        <Text className="font-sans-bold text-xs text-primary">
          Открыть на карте
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="font-sans-bold text-2xl text-primary">Маршруты</Text>
          <Text className="mt-0.5 font-sans-medium text-xs text-muted-foreground">
            Каталог дорог и история ваших поездок
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/(tabs)/map")}
          className="rounded-full bg-primary px-4 py-2 active:opacity-75"
        >
          <Text className="font-sans-bold text-xs text-background">
            + Новый
          </Text>
        </Pressable>
      </View>

      <View className="mb-3 flex-row items-center rounded-xl border border-border bg-card px-4 py-3">
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Поиск маршрута или региона..."
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

      <View className="mb-4 flex-row rounded-2xl border border-border bg-muted p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`flex-1 items-center rounded-xl py-2 ${
                isActive ? "bg-primary" : "bg-transparent"
              }`}
            >
              <Text
                className={`font-sans-semibold text-xs ${
                  isActive ? "text-background" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredRoutes}
        keyExtractor={(item) => item.id}
        renderItem={renderRouteCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
        ListEmptyComponent={
          <View className="items-center justify-center rounded-2xl border border-border bg-card px-6 py-12">
            <Text className="font-sans-bold text-base text-primary">
              Маршруты не найдены
            </Text>
            <Text className="mt-1 text-center font-sans-medium text-xs text-muted-foreground">
              Попробуйте сбросить поиск или создать свой маршрут на карте
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Routes;
