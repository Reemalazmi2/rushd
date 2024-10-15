import { uniFacility } from '../data/AJData.js';


let map = L.map('map').setView([27.563073576201173, 41.700262995401836],16.4);

L.tileLayer('https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=dHw0UMIl4hh0KzSUqiMq', {
  maxZoom: 19,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

L.geoJSON(uniFacility).addTo(map);