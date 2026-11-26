import { formatDistance, useRouteStore } from "@/store/useRouteStore";
import {
  Camera,
  CameraRef,
  GeoJSONSource,
  Layer,
  Map,
  Marker,
  StyleSpecification,
  type LngLat,
} from "@maplibre/maplibre-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const DEFAULT_CENTER: LngLat = [37.1814, 55.9825]; // Zelenograd

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [{ id: "osm-layer", type: "raster", source: "osm" }],
};

export default function MotoMap() {
  const router = useRouter();
  const [isRiding, setIsRiding] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const addRoute = useRouteStore((store) => store.addRoute);

  useEffect(() => {
    if (!isRiding) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRiding]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSaveToRoutes = () => {
    addRoute({
      title: `${startStreet} — ${destStreet}`,
      region: "Мой маршрут",
      distance: Number(distance) || 0,
      duration: Number(duration) || 900,
      difficulty: Number(distance) > 90000 ? "Серпантин" : "Средний",
      isFavorite: true,
      isCompleted: false,
      author: "Александр Иванов",
      coords: routeCoords,
    });
    Alert.alert(
      "Маршрут сохранён",
      `${startStreet} — ${destStreet} (${formatDistance(distance)}) добавлен в ваши маршруты.`,
    );
    router.push({
      pathname: "/(tabs)/routes",
    });
  };

  const selectedRoute = useRouteStore((store) => store.selectedRoute);
  const selectRouteForMap = useRouteStore((store) => store.selectRouteForMap);
  const markRouteCompleted = useRouteStore((store) => store.markRouteCompleted);
  const completeRide = useRouteStore((store) => store.completeRide);
  const [activeMode, setActiveMode] = useState<"start" | "end">("start");

  const [startPoint, setStartPoint] = useState<LngLat | null>(DEFAULT_CENTER);
  const [startStreet, setStartStreet] = useState("Зеленоград (старт)");

  const [destPoint, setDestPoint] = useState<LngLat | null>(null);
  const [destStreet, setDestStreet] = useState("Нажмите на карту");

  const [routeCoords, setRouteCoords] = useState<LngLat[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchStreetName = async ([lon, lat]: LngLat): Promise<string> => {
    try {
      const nominatimHost = ["nominatim", "openstreetmap", "org"].join(".");
      const geoUrl = `https://${nominatimHost}/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ru`;
      const geoRes = await fetch(geoUrl, {
        headers: { "User-Agent": "MotoWayStudentApp/1.0" },
      });
      const geoData = await geoRes.json();
      return (
        geoData?.address?.road ||
        geoData?.address?.suburb ||
        geoData?.display_name?.split(",")[0] ||
        `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      );
    } catch {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  const buildRoute = async (from: LngLat, to: LngLat) => {
    try {
      const osrmHost = ["router", "project-osrm", "org"].join(".");
      const routeUrl = `https://${osrmHost}/route/v1/driving/${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=geojson`;
      const routeRes = await fetch(routeUrl);
      const routeData = await routeRes.json();
      const firstRoute = routeData?.routes?.[0];

      if (routeData?.code !== "Ok" || !firstRoute) {
        Alert.alert(
          "Маршрут по суше не найден",
          "Не удалось найти дорогу рядом с точкой или построить маршрут по суше.",
        );
        setDestPoint(null);
        setDestStreet("Нажмите на карту");
        setRouteCoords([]);
        setDistance(0);
        setDuration(0);
        return;
      }

      // const usesFerry = firstRoute?.legs?.some((leg: any) =>
      //   leg.steps?.some(
      //     (step: any) => step.mode === "ferry" || step.mode === "train",
      //   ),
      // );

      // if (usesFerry) {
      //   Alert.alert(
      //     "Маршрут включает паром",
      //     "Публичный сервер OSRM не может построить объезд по суше для этой точки.",
      //   );
      //   setDestPoint(null);
      //   setDestStreet("Нажмите на карту");
      //   setRouteCoords([]);
      //   setDistance(0);
      //   setDuration(0);
      //   return;
      // }

      const trip = firstRoute?.geometry?.coordinates;

      if (trip && trip.length > 0) {
        setRouteCoords(trip);
        setDistance(Math.floor(firstRoute.distance));
        setDuration(
          Math.floor(
            selectedRoute ? firstRoute.duration : firstRoute.duration * 1.45,
          ),
        );
      } else {
        setRouteCoords([from, to]);
        setDistance(0);
        setDuration(0);
      }
    } catch (err) {
      console.log("Route lookup error:", err);
      setRouteCoords([from, to]);
      setDistance(0);
      setDuration(0);
    }
  };
  const cameraRef = useRef<CameraRef>(null);
  const handleMapPress = async (event: any) => {
    selectRouteForMap(null);
    const coords: LngLat =
      event?.lngLat ||
      event?.nativeEvent?.lngLat ||
      event?.geometry?.coordinates;
    if (!coords) return;

    setLoading(true);

    let nextStart = startPoint;
    let nextDest = destPoint;

    if (activeMode === "start") {
      nextStart = coords;
      setStartPoint(coords);
      setStartStreet("Загрузка адреса...");
      setActiveMode("end");

      const name = await fetchStreetName(coords);
      setStartStreet(name);
    } else {
      nextDest = coords;
      setDestPoint(coords);
      setDestStreet("Загрузка адреса...");

      const name = await fetchStreetName(coords);
      setDestStreet(name);
    }

    if (nextStart && nextDest) {
      await buildRoute(nextStart, nextDest);
    }

    setLoading(false);
  };

  const handleFinishRide = () => {
    if (selectedRoute) {
      markRouteCompleted(selectedRoute.id);
    } else if (routeCoords.length > 1) {
      completeRide({
        title: `${startStreet} — ${destStreet}`,
        region: "Мой маршрут",
        distance: Number(distance) || 0,
        duration: Number(seconds),
        difficulty: Number(distance) > 90000 ? "Серпантин" : "Средний",
        isFavorite: true,
        isCompleted: false,
        author: "Александр Иванов",
        coords: routeCoords,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!selectedRoute || selectedRoute.coords.length < 2) return;

      const first = selectedRoute.coords.at(0) as LngLat;
      const last = selectedRoute.coords.at(-1) as LngLat;
      const mid = selectedRoute.coords.at(
        Math.floor(selectedRoute.coords.length / 2),
      ) as LngLat;

      const parts = selectedRoute.title.split("—");

      setStartPoint(first);
      setDestPoint(last);
      setStartStreet(parts.at(0)?.trim() || "Старт маршрута");
      setDestStreet(parts.at(1)?.trim() || selectedRoute.title);
      setRouteCoords(selectedRoute.coords);
      setDistance(selectedRoute.distance);
      setDuration(selectedRoute.duration);

      setTimeout(() => {
        cameraRef?.current?.flyTo({
          center: mid,
          zoom: 9,
          duration: 600,
        });
      }, 150);

      if (selectedRoute.coords.length <= 5) {
        setLoading(true);
        buildRoute(first, last).finally(() => setLoading(false));
      }
    }, [selectedRoute]),
  );

  const handleClear = () => {
    setStartPoint(null);
    setStartStreet("Не выбрана");
    setDestPoint(null);
    setDestStreet("Не выбрана");
    setRouteCoords([]);
    setDistance(0);
    setDuration(0);
    setActiveMode("start");
  };

  const routeGeoJSON =
    routeCoords.length > 1
      ? {
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: routeCoords,
          },
          properties: {},
        }
      : null;

  return (
    <View className="flex-1 bg-background">
      <Map style={{ flex: 1 }} onPress={handleMapPress} mapStyle={MAP_STYLE}>
        <Camera
          ref={cameraRef}
          initialViewState={{ center: DEFAULT_CENTER, zoom: 11 }}
          maxZoom={18}
        />
        {startPoint && (
          <Marker id="start" lngLat={startPoint}>
            <View className="size-6 items-center justify-center rounded-full border-2 border-card bg-primary">
              <Text className="text-[10px] font-bold text-background">А</Text>
            </View>
          </Marker>
        )}

        {destPoint && (
          <Marker id="end" lngLat={destPoint}>
            <View className="size-6 items-center justify-center rounded-full border-2 border-card bg-accent">
              <Text className="text-[10px] font-bold text-primary">Б</Text>
            </View>
          </Marker>
        )}

        {routeGeoJSON && (
          <GeoJSONSource id="routeSource" data={routeGeoJSON}>
            <Layer
              id="routeLine"
              type="line"
              paint={{ "line-color": "#ea7a53", "line-width": 5 }}
              layout={{ "line-cap": "round", "line-join": "round" }}
            />
          </GeoJSONSource>
        )}
      </Map>

      <SafeAreaView
        edges={["bottom"]}
        className="mb-16 rounded-t-3xl border-t border-border bg-background p-5"
      >
        <View className="mb-3 flex-row gap-2">
          <Pressable
            onPress={() => setActiveMode("start")}
            className={`flex-1 rounded-xl border p-2.5 ${
              activeMode === "start"
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <Text className="font-sans-medium text-[11px] text-muted-foreground">
              Откуда (Точка А)
            </Text>
            <Text
              className="mt-0.5 font-sans-bold text-sm text-primary"
              numberOfLines={1}
            >
              {startStreet}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveMode("end")}
            className={`flex-1 rounded-xl border p-2.5 ${
              activeMode === "end"
                ? "border-accent bg-accent/10"
                : "border-border bg-card"
            }`}
          >
            <Text className="font-sans-medium text-[11px] text-muted-foreground">
              Куда (Точка Б)
            </Text>
            <Text
              className="mt-0.5 font-sans-bold text-sm text-primary"
              numberOfLines={1}
            >
              {destStreet}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            {distance && duration !== null ? (
              <Text className="font-sans-semibold text-sm text-accent">
                {Math.floor(distance / 1000)} км • ~{Math.floor(duration / 60)}{" "}
                мин в пути
              </Text>
            ) : (
              <Text className="font-sans-medium text-xs text-muted-foreground">
                {activeMode === "start"
                  ? "Нажмите на карту, чтобы указать точку А"
                  : "Нажмите на карту, чтобы указать точку Б"}
              </Text>
            )}
          </View>
          {loading && <ActivityIndicator color="#ea7a53" />}
        </View>

        {isRiding ? (
          <View className="mt-3">
            <View className="mb-3 flex-row justify-around rounded-2xl bg-primary py-3">
              <View className="items-center">
                <Text className="font-sans-bold text-lg text-white">
                  {formatTime(seconds)}
                </Text>
                <Text className="text-xs text-white/70">Время</Text>
              </View>
              <View className="items-center">
                <Text className="font-sans-bold text-lg text-accent">
                  {formatDistance(distance)}
                </Text>
                <Text className="text-xs text-white/70">Маршрут</Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                setIsRiding(false);
                setSeconds(0);
                handleFinishRide();
              }}
              className="items-center rounded-2xl bg-destructive py-3 active:opacity-75"
            >
              <Text className="font-sans-bold text-sm text-white">
                Завершить заезд
              </Text>
            </Pressable>
          </View>
        ) : (
          (startPoint || destPoint) && (
            <View className="mt-3 flex-row gap-2">
              <Pressable
                onPress={handleClear}
                className="items-center justify-center rounded-2xl border border-border bg-card px-4 py-3 active:opacity-75"
              >
                <Text className="font-sans-bold text-xs text-primary">
                  Сбросить
                </Text>
              </Pressable>

              {routeCoords.length > 1 && (
                <>
                  <Pressable
                    onPress={handleSaveToRoutes}
                    className="flex-1 items-center justify-center rounded-2xl bg-subscription py-3 active:opacity-75"
                  >
                    <Text className="font-sans-bold text-xs text-primary">
                      Сохранить
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          )
        )}
      </SafeAreaView>
    </View>
  );
}
