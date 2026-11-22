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
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);
const DEFAULT_CENTER: LngLat = [37.1814, 55.9825]; // Zelenograd

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
  const [activeMode, setActiveMode] = useState<'start' | 'end'>('start');

  const [startPoint, setStartPoint] = useState<LngLat | null>(DEFAULT_CENTER);
  const [startStreet, setStartStreet] = useState('Зеленоград (старт)');

  const [destPoint, setDestPoint] = useState<LngLat | null>(null);
  const [destStreet, setDestStreet] = useState('Нажмите на карту');

  const [routeCoords, setRouteCoords] = useState<LngLat[]>([]);
  const [distanceKm, setDistanceKm] = useState<string | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStreetName = async ([lon, lat]: LngLat): Promise<string> => {
    try {
      const nominatimHost = ['nominatim', 'openstreetmap', 'org'].join('.');
      const geoUrl = `https://${nominatimHost}/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ru`;
      const geoRes = await fetch(geoUrl, {
        headers: { 'User-Agent': 'MotoWayStudentApp/1.0' },
      });
      const geoData = await geoRes.json();
      return (
        geoData?.address?.road ||
        geoData?.address?.suburb ||
        geoData?.display_name?.split(',')[0] ||
        `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      );
    } catch {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  const buildRoute = async (from: LngLat, to: LngLat) => {
    try {
      const osrmHost = ['router', 'project-osrm', 'org'].join('.');
      const routeUrl = `https://${osrmHost}/route/v1/driving/${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=geojson`;
      const routeRes = await fetch(routeUrl);
      const routeData = await routeRes.json();
      const firstRoute = routeData?.routes?.[0];
      const trip = firstRoute?.geometry?.coordinates;

      if (trip && trip.length > 0) {
        setRouteCoords(trip);
        setDistanceKm((firstRoute.distance / 1000).toFixed(1));
        setDurationMin(Math.round(firstRoute.duration / 60));
      } else {
        setRouteCoords([from, to]);
        setDistanceKm(null);
        setDurationMin(null);
      }
    } catch (err) {
      console.log('Route lookup error:', err);
      setRouteCoords([from, to]);
      setDistanceKm(null);
      setDurationMin(null);
    }
  };

  const handleMapPress = async (event: any) => {
    const coords: LngLat =
      event?.lngLat || event?.nativeEvent?.lngLat || event?.geometry?.coordinates;
    if (!coords) return;

    setLoading(true);

    let nextStart = startPoint;
    let nextDest = destPoint;

    if (activeMode === 'start') {
      nextStart = coords;
      setStartPoint(coords);
      setStartStreet('Загрузка адреса...');
      setActiveMode('end');

      const name = await fetchStreetName(coords);
      setStartStreet(name);
    } else {
      nextDest = coords;
      setDestPoint(coords);
      setDestStreet('Загрузка адреса...');

      const name = await fetchStreetName(coords);
      setDestStreet(name);
    }

    if (nextStart && nextDest) {
      await buildRoute(nextStart, nextDest);
    }

    setLoading(false);
  };

  const handleClear = () => {
    setStartPoint(null);
    setStartStreet('Не выбрана');
    setDestPoint(null);
    setDestStreet('Не выбрана');
    setRouteCoords([]);
    setDistanceKm(null);
    setDurationMin(null);
    setActiveMode('start');
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
        <Camera initialViewState={{ center: DEFAULT_CENTER, zoom: 11 }} />

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
              paint={{ 'line-color': '#ea7a53', 'line-width': 5 }}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            />
          </GeoJSONSource>
        )}
      </Map>

      <SafeAreaView
        edges={['bottom']}
        className="mb-16 rounded-t-3xl border-t border-border bg-background p-5"
      >
        <View className="mb-3 flex-row gap-2">
          <Pressable
            onPress={() => setActiveMode('start')}
            className={`flex-1 rounded-xl border p-2.5 ${
              activeMode === 'start'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
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
            onPress={() => setActiveMode('end')}
            className={`flex-1 rounded-xl border p-2.5 ${
              activeMode === 'end'
                ? 'border-accent bg-accent/10'
                : 'border-border bg-card'
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
            {distanceKm && durationMin !== null ? (
              <Text className="font-sans-semibold text-sm text-accent">
                {distanceKm} км • ~{durationMin} мин в пути
              </Text>
            ) : (
              <Text className="font-sans-medium text-xs text-muted-foreground">
                {activeMode === 'start'
                  ? 'Нажмите на карту, чтобы указать точку А'
                  : 'Нажмите на карту, чтобы указать точку Б'}
              </Text>
            )}
          </View>
          {loading && <ActivityIndicator color="#ea7a53" />}
        </View>

        {(startPoint || destPoint) && (
          <Pressable
            onPress={handleClear}
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
