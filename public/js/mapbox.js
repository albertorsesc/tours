/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'pk.eyJ1IjoiYmNyeXA3IiwiYSI6ImNsN3Y1b3JwczA4azQzb212OGlncThpZnkifQ.9qfVFuf0P2NbtENc2x4YZg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/bcryp7/cl7v8zedv000b15sdurkm8e00',
  scrollZoom: false,
  // center: [-118.337771, 34.071846],
  // zoom: 3,
  // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(location => {
  const element = document.createElement('div');
  element.className = 'marker';

  new mapboxgl.Marker({
    element: element,
    anchor: 'bottom',
  })
  .setLngLat(location.coordinates)
  .addTo(map);

  new mapboxgl.Popup({
    offset: 30
  })
  .setLngLat(location.coordinates)
  .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
  .addTo(map);

  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  }
});