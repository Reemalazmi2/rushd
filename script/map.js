import { uniFacility } from '../data/AJData.js';
import { facilities } from '../data/facility.js';

let map = L.map('map').setView([27.563073576201173, 41.700262995401836],16.4);

L.tileLayer('https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=dHw0UMIl4hh0KzSUqiMq', {
  maxZoom: 19,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

function LookForFacility() {
  document.querySelectorAll('.js-look-for-facility')
    .forEach((button) => {
      button.addEventListener('click', function() {
        const facilityId = button.getAttribute('data-facility-id'); // الحصول على id المرفق من زر الضغط

        // إزالة جميع الطبقات السابقة من الخريطة
        map.eachLayer(layer => {
          if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
          }
        });

        // فلترة الميزات بناءً على id المختار
        const filteredFeatures = uniFacility.features.filter(feature => {
          return feature.properties.facility === facilityId;
        });

        if (filteredFeatures.length > 0) {
          // إضافة GeoJSON المفلتر إلى الخريطة
          L.geoJSON({
            type: 'FeatureCollection',
            features: filteredFeatures
          } /*
              add popup
          , {
            onEachFeature: function(feature, layer) {
              layer.bindPopup(feature.properties.name || "Unnamed Facility");
            }
          }*/ ).addTo(map);
        }
      });
    });
}

// استدعاء الوظيفة
LookForFacility();



