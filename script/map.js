import { uniFacility } from '../data/AJData.js';
import { facilities } from '../data/facility.js';
import { routing } from './userlocation.js';

// تجهيز الخريطة
export const map = L.map('map').setView([27.563073576201173, 41.700262995401836],16.4);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=' + 'pk.eyJ1IjoicmVlbWFsYXptaSIsImEiOiJjbTJqZ2lvM3gwNTM2Mm1yMWdxY3Q5YThkIn0.VtsPhjheCaixoSNbnk2siw', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://www.mapbox.com/">Mapbox</a>',

}).addTo(map);

let markersArray = [];

// دالة لصنع زر 
function createButton(label, container) {
  var btn = L.DomUtil.create('button', '', container);
  btn.setAttribute('type', 'button');
  btn.innerHTML = label;
  return btn;
}

//دالة لاضافة الاماكن للخريطة
function addGeoJson(filteredFeatures) {
  // إزالة الطبقات السابقة من الخريطة
  map.eachLayer(layer => {
    if (layer instanceof L.GeoJSON) {
      map.removeLayer(layer);
    }
  });

  //اضافة المبنى للخريطة
  const geojsonLayer = L.geoJSON({
    type: 'FeatureCollection',
    features: filteredFeatures
  }).addTo(map);

  geojsonLayer.eachLayer(function(layer) {
    // اضافة النافذة المنبثقة والتوجية للنقاط
    if (layer instanceof L.Marker) {
      markersArray.push(layer);
      
      const featureName = layer.feature.properties.name; 
      layer.on('click', function(e) {
        let container = L.DomUtil.create('div');
      
        // إضافة نص
        let text = L.DomUtil.create('p', '', container);
        text.innerHTML = `${featureName}`;
      
        // إضافة زر
        let actionBtn = createButton('اذهب', container);
        
        // ربط حدث الزر لتشغيل التوجية
        L.DomEvent.on(actionBtn, 'click', () => {
          routing(layer.feature); 
          map.closePopup(); 
          map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
              map.removeLayer(layer);
            }
          });
        });

        // فتح النافذة المنبثقة
        L.popup()
          .setContent(container)
          .setLatLng(e.latlng)
          .openOn(map);
      });
      
      // اضافة النافذة المنبثقة والتوجية للمضلعات
    } else if (layer instanceof L.Polygon) {
      
      layer.on('click', function(e) {
        let container = L.DomUtil.create('div');

        // إضافة نص
        let text = L.DomUtil.create('p', '', container);
        text.innerHTML = `${layer.feature.properties.name}`;

        // إضافة زر
        let actionBtn = createButton('اذهب', container);

        // ربط حدث الزر لتشغيل التوجية
        L.DomEvent.on(actionBtn, 'click', () => {
          routing(layer.feature); 
          map.closePopup(); 
          map.eachLayer(layer => {
            if (layer instanceof L.Polygon) {
              map.removeLayer(layer);
            }
          });
        });

        // فتح النافذة المنبثقة
        L.popup()
          .setContent(container)
          .setLatLng(e.latlng)
          .openOn(map);
    });
    }
  });

  const geometryType = filteredFeatures[0].geometry.type;
  
  if (geometryType === 'Point' || geometryType === 'Polygon' || geometryType === "MultiPolygon") {
    map.fitBounds(geojsonLayer.getBounds(), {
      padding: [100, 100]
    });
  }

}

// دالة البحث عن المباني باستخدام الازارا المعروضة
function LookForFacility() {
  document.querySelectorAll('.js-look-for-facility')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const facilityId = button.getAttribute('data-facility-id'); 

        const filteredFeatures = uniFacility.features.filter(feature => {
          return feature.properties.facility === facilityId;
        });
        
        if (filteredFeatures.length > 0) {
          addGeoJson(filteredFeatures);
        }
        
      });
    });
    
}

LookForFacility();

// البحث عن مبنى باستعمال خانة البحث
function renderFacilities(facilities) {
  const searchList = document.getElementById('searchList');
  searchList.innerHTML = '';
  facilities.forEach((facility) => {
      const li = document.createElement('li');
      li.textContent = facility.properties.name;
      li.onclick = function() {
        showBuilding(facility);
        searchList.innerHTML= '';
        searchInput.value = '';
      };
      searchList.appendChild(li);
  });
}

// عرض المبنى عند الضغط على نتائج البحث
function showBuilding(facility) {
  const facilityId = facility.properties.id;

  const filteredFeatures = uniFacility.features.filter(feature => {
      return feature.properties.id === facilityId;
  });

  if (filteredFeatures.length > 0) {
      addGeoJson(filteredFeatures);
  } 

}

// تفعيل البحث 
document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('searchInput')
    .addEventListener('keyup', function() {
      const searchValue = this.value.toLowerCase(); 

      if (searchValue) {
            const filteredFacilities = uniFacility.features.filter( facility => {
              const facilityName = facility.properties.name; 
              return typeof facilityName === 'string' && facilityName.toLowerCase().includes(searchValue);

          });
          renderFacilities(filteredFacilities); 
      } else {
          renderFacilities([]);
      }
    });
});

