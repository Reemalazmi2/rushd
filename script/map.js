import { uniFacility } from '../data/AJData.js';
import { facilities } from '../data/facility.js';

export let map = L.map('map').setView([27.563073576201173, 41.700262995401836],16.4);

L.tileLayer('https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=dHw0UMIl4hh0KzSUqiMq', {
  maxZoom: 19,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

function LookForFacility() {
  document.querySelectorAll('.js-look-for-facility')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const facilityId = button.getAttribute('data-facility-id'); 

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

          const bounds = L.latLngBounds();

          filteredFeatures.forEach(feature => {
            if (feature.geometry.type === "Point") {
              // إذا كانت الميزة نقطة، أضف إحداثياتها
              bounds.extend(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
            } else if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
              // إذا كانت الميزة مضلع، أضف جميع الإحداثيات
              feature.geometry.coordinates[0].forEach(coord => {
                bounds.extend(L.latLng(coord[1], coord[0]));
              });
            } else if (feature.geometry.type === "LineString" || feature.geometry.type === "MultiLineString") {
              // إذا كانت الميزة خط، أضف جميع الإحداثيات
              feature.geometry.coordinates.forEach(coord => {
                bounds.extend(L.latLng(coord[1], coord[0]));
              });
            }
          });

          // تقريب الخريطة إلى الحدود
          map.fitBounds(bounds);

        }
      });
    });
}

// استدعاء الوظيفة
LookForFacility();

function renderFacilities(facilities) {
  const searchList = document.getElementById('searchList');
  searchList.innerHTML = '';// مسح القائمة السابقة
  facilities.forEach((facility) => {
      const li = document.createElement('li');
      li.textContent = facility.properties.name; // إضافة اسم المرفق إلى القائمة
      li.onclick = function() {
        showBuilding(facility);
      };
      searchList.appendChild(li); // التأكد من أن searchList هو عنصر صالح
  });
}



function showBuilding(facility) {
  const facilityId = facility.properties.id;

  // إزالة جميع طبقات GeoJSON السابقة من الخريطة
  map.eachLayer(layer => {
      if (layer instanceof L.GeoJSON) {
          map.removeLayer(layer);
      }
  });

  // تصفية الميزات بناءً على الـ id
  const filteredFeatures = uniFacility.features.filter(feature => {
      return feature.properties.id === facilityId;
  });

  if (filteredFeatures.length > 0) {
      // إضافة GeoJSON المفلتر إلى الخريطة
      const geojsonLayer = L.geoJSON({
          type: 'FeatureCollection',
          features: filteredFeatures
      }).addTo(map);

      // تعيين العرض بناءً على نوع الهندسة
      const geometryType = filteredFeatures[0].geometry.type;

      if (geometryType === 'Point') {
          map.fitBounds(geojsonLayer.getBounds()); // تعيين العرض للنقطة بمستوى تكبير أكبر
      } else if (geometryType === 'Polygon') {
          // ضبط الخريطة لتناسب حدود المضلع
          map.fitBounds(geojsonLayer.getBounds());
      }
  } else {
      console.log('لا توجد ميزات تطابق الـ id المحدد.');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // لا تعرض أي مرافق عند التحميل

  // إضافة مستمع للبحث
  document.getElementById('searchInput')
    .addEventListener('keyup', function() {
      const searchValue = this.value.toLowerCase(); // الحصول على قيمة البحث وتحويلها إلى حروف صغيرة

      if (searchValue) {
            const filteredFacilities = uniFacility.features.filter( facility => {
              const facilityName = facility.properties.name; // الحصول على الاسم
              return typeof facilityName === 'string' && facilityName.toLowerCase().includes(searchValue);

          });
          renderFacilities(filteredFacilities); // إعادة عرض المرافق المفلترة
      
      } else {
          renderFacilities([]); // عرض قائمة فارغة إذا كان حقل البحث فارغًا
      }
    });
    
});