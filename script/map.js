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
      searchList.appendChild(li); // التأكد من أن searchList هو عنصر صالح
  });
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
