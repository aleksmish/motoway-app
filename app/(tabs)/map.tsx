import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  Marker,
  StyleSpecification,
  type LngLat,
} from '@maplibre/maplibre-react-native';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);
const START_POINT: LngLat = [37.1814, 55.9825]; // Zelenograd

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
    },
  },
  layers: [{ id: 'osm-layer', type: 'raster', source: 'osm' }],
};

export default function MotoMap() {
  const [destPoint, setDestPoint] = useState<LngLat | null>(null);
  const [streetName, setStreetName] = useState('Нажмите на карту для выбора точки');
  const [routeCoords, setRouteCoords] = useState<LngLat[]>([]);
  const [distanceKm, setDistanceKm] = useState<string | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

    const handleMapPress = async (event: any) => {
    const coords: LngLat =
      event?.lngLat || event?.nativeEvent?.lngLat || event?.geometry?.coordinates;
    if (!coords) return;

    const [lon, lat] = coords;
    setDestPoint([lon, lat]);
    setLoading(true);

    try {
      // 1. Get Russian street name from Nominatim
      const nominatimHost = ["nominatim", "openstreetmap", "org"].join(".");
      const geoUrl = `https://${nominatimHost}/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ru`;
      const geoRes = await fetch(geoUrl, {
        headers: { "User-Agent": "MotoWayStudentApp/1.0" },
      });
      const geoData = await geoRes.json();
      const road =
        geoData?.address?.road ||
        geoData?.address?.suburb ||
        geoData?.display_name?.split(",")[0] ||
        `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      setStreetName(road);

      // 2. Get road-snapped route from OSRM
      const osrmHost = ["router", "project-osrm", "org"].join(".");
      const routeUrl = `https://${osrmHost}/route/v1/driving/${START_POINT[0]},${START_POINT[1]};${lon},${lat}?overview=full&geometries=geojson`;
      const routeRes = await fetch(routeUrl);
      const routeData = await routeRes.json();
      const firstRoute = routeData?.routes?.[0];
      const trip = firstRoute?.geometry?.coordinates;

      if (trip && trip.length > 0) {
        setRouteCoords(trip);
        setDistanceKm((firstRoute.distance / 1000).toFixed(1));
        setDurationMin(Math.round(firstRoute.duration / 60));
      } else {
        setRouteCoords([START_POINT, [lon, lat]]);
      }
    } catch (err) {
      console.log("Map lookup error:", err);
      setStreetName(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
      setRouteCoords([START_POINT, [lon, lat]]);
    } finally {
      setLoading(false);
    }
  };

  const routeGeoJSON =
    routeCoords.length > 1
      ? {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: routeCoords,
          },
          properties: {},
        }
      : null;

  return (
    <View className="flex-1 bg-background">
      <Map style={{ flex: 1 }} onPress={handleMapPress} mapStyle={MAP_STYLE}>
        <Camera initialViewState={{ center: START_POINT, zoom: 11 }} />
        <Marker id="start" lngLat={START_POINT}>
          <View className="size-5 rounded-full border-2 border-card bg-primary" />
        </Marker>
        {destPoint && (
          <Marker id="end" lngLat={destPoint}>
            <View className="size-5 rounded-full border-2 border-card bg-accent" />
          </Marker>
        )}
        {routeGeoJSON && (
          <GeoJSONSource id="routeSource" data={routeGeoJSON}>
            <Layer
              id="routeLine"
              type="line"
              paint={{ 'line-color': '#ea7a53', 'line-width': 5 }}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            />
          </GeoJSONSource>
        )}
      </Map>

      <SafeAreaView
        edges={['bottom']}
        className="rounded-t-3xl border-t border-border bg-background p-5 mb-16"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-sans-medium text-xs text-muted-foreground">
              Точка назначения
            </Text>
            <Text
              className="mt-0.5 font-sans-bold text-lg text-primary"
              numberOfLines={1}
            >
              {streetName}
            </Text>
            {distanceKm && durationMin !== null && (
              <Text className="mt-1 font-sans-semibold text-xs text-accent">
                {distanceKm} км • ~{durationMin} мин в пути
              </Text>
            )}
          </View>
          {loading && <ActivityIndicator color="#ea7a53" />}
        </View>

        {destPoint && (
          <Pressable
            onPress={() => {
              setDestPoint(null);
              setRouteCoords([]);
              setDistanceKm(null);
              setDurationMin(null);
              setStreetName('Нажмите на карту для выбора точки');
            }}
            className="mt-3 items-center rounded-2xl bg-accent py-3 active:opacity-75"
          >
            <Text className="font-sans-bold text-sm text-primary">
              Очистить маршрут
            </Text>
          </Pressable>
        )}
      </SafeAreaView>
    </View>
  );
}
