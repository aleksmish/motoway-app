export const buildMapHtml = (
  coords: number[][],
  destination: string,
  companionName: string | null
) => {
  const safeCoords = JSON.stringify(coords);
  const safeDest = JSON.stringify(destination);
  const safeCompanion = JSON.stringify(companionName);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com" />
  <script src="https://unpkg.com"></script>
  <style>
    html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #f6eecf; }
    .leaflet-control-attribution { display: none; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var coords = ${safeCoords};
    var dest = ${safeDest};
    var companion = ${safeCompanion};

    var map = L.map('map', { zoomControl: false }).setView([56.14, 37.65], 9);

    L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
      maxZoom: 18
    }).addTo(map);

    var line = L.polyline(coords, { color: '#ea7a53', weight: 5 }).addTo(map);
    map.fitBounds(line.getBounds(), { padding: [50, 50] });

    var startPt = coords[0];
    var endPt = coords[coords.length - 1];

    L.circleMarker(startPt, {
      radius: 8, fillColor: '#081126', color: '#fff8e7', weight: 3, fillOpacity: 1
    }).addTo(map).bindPopup('Вы • Kawasaki Ninja ZX-10R');

    L.circleMarker(endPt, {
      radius: 8, fillColor: '#ea7a53', color: '#fff8e7', weight: 3, fillOpacity: 1
    }).addTo(map).bindPopup(dest);

    if (companion) {
      L.circleMarker([56.085, 37.31], {
        radius: 8, fillColor: '#16a34a', color: '#fff8e7', weight: 3, fillOpacity: 1
      }).addTo(map).bindPopup(companion + ' (В пути)');
    }
  </script>
</body>
</html>
  `;
};
