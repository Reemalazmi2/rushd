import { uniFacility } from '../data/AJData.js';
import { facilities } from '../data/facility.js';
import { routing } from './userlocation.js';

export const map = L.map('map').setView([27.563073576201173, 41.700262995401836],16.4);

L.tileLayer('https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=dHw0UMIl4hh0KzSUqiMq', {
  maxZoom: 19,
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);


function addGeoJson(filteredFeatures) {
  map.eachLayer(layer => {
    if (layer instanceof L.GeoJSON) {
        map.removeLayer(layer);
    }
  });

  const geojsonLayer = L.geoJSON({
    type: 'FeatureCollection',
    features: filteredFeatures
  }).addTo(map);

  const geometryType = filteredFeatures[0].geometry.type;
  if (geometryType === 'Point') {
      map.fitBounds(geojsonLayer.getBounds(), {
        padding: [100,100]
      }); // تعيين العرض للنقطة بمستوى تكبير أكبر
  } else if (geometryType === 'Polygon' || feature.geometry.type === "MultiPolygon") {
      // ضبط الخريطة لتناسب حدود المضلع
      map.fitBounds(geojsonLayer.getBounds(), {
        padding: [100,100]
      });
  }
}


function LookForFacility() {
  document.querySelectorAll('.js-look-for-facility')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const facilityId = button.getAttribute('data-facility-id'); 

        // فلترة الميزات بناءً على id المختار
        const filteredFeatures = uniFacility.features.filter(feature => {
          return feature.properties.facility === facilityId;
        });

        if (filteredFeatures.length > 0) {
          addGeoJson(filteredFeatures);

          routing(filteredFeatures);
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
        searchList.innerHTML= '';
        searchInput.value = '';
      };
      searchList.appendChild(li); // التأكد من أن searchList هو عنصر صالح
  });
}



function showBuilding(facility) {
  const facilityId = facility.properties.id;

  // تصفية الميزات بناءً على الـ id
  const filteredFeatures = uniFacility.features.filter(feature => {
      return feature.properties.id === facilityId;
  });

  if (filteredFeatures.length > 0) {
      addGeoJson(filteredFeatures);
  } 

}


document.addEventListener('DOMContentLoaded', () => {
  // لا تعرض أي مرافق عند التحميل

  // إضافة مستمع للبحث
  const searchInput = document.getElementById('searchInput')
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

