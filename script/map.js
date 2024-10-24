import { uniFacility } from '../data/AJData.js';
import { facilities } from '../data/facility.js';
import { routing, routeToDestination } from './userlocation.js';

export const map = L.map('map').setView([27.563073576201173, 41.700262995401836],16.4);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=' + 'pk.eyJ1IjoicmVlbWFsYXptaSIsImEiOiJjbTJqZ2lvM3gwNTM2Mm1yMWdxY3Q5YThkIn0.VtsPhjheCaixoSNbnk2siw', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://www.mapbox.com/">Mapbox</a>',

}).addTo(map);

let markersArray = [];

function createButton(label, container) {
  var btn = L.DomUtil.create('button', '', container);
  btn.setAttribute('type', 'button');
  btn.innerHTML = label;
  return btn;
}

function addGeoJson(filteredFeatures) {
  // إزالة الطبقات السابقة من الخريطة
  map.eachLayer(layer => {
    if (layer instanceof L.GeoJSON) {
      map.removeLayer(layer);
    }
  });

  const geojsonLayer = L.geoJSON({
    type: 'FeatureCollection',
    features: filteredFeatures
  }).addTo(map);

  geojsonLayer.eachLayer(function(layer) {
    if (layer instanceof L.Marker) {
      markersArray.push(layer);
      
      // إعداد النافذة المنبثقة باستخدام id كمعرف فريد
      const featureName = layer.feature.properties.name; // تأكد من أن لديك خاصية id
      layer.on('click', function(e) {
        let container = L.DomUtil.create('div');
      
        // إضافة نص
        let text = L.DomUtil.create('p', '', container);
        text.innerHTML = `${featureName}`;
      
        // إضافة زر
        let actionBtn = createButton('اذهب', container);
        
        // ربط حدث الزر
        L.DomEvent.on(actionBtn, 'click', () => {
          routing(layer.feature); // تأكد من أن هذه الدالة موجودة
          map.closePopup(); // إغلاق النافذة المنبثقة بعد النقر
        });

        // فتح النافذة المنبثقة
        L.popup()
          .setContent(container)
          .setLatLng(e.latlng)
          .openOn(map);
      });
    } else if (layer instanceof L.Polygon) {
      // إعداد النافذة المنبثقة عند الضغط على المضلع
      layer.on('click', function(e) {
        let container = L.DomUtil.create('div');

        // إضافة نص
        let text = L.DomUtil.create('p', '', container);
        text.innerHTML = `${layer.feature.properties.name}`;

        // إضافة زر
        let actionBtn = createButton('اذهب', container);

        // ربط حدث الزر
        L.DomEvent.on(actionBtn, 'click', () => {
          routing(layer.feature); // تمرير الميزة إلى دالة التوجيه
          map.closePopup(); // إغلاق النافذة المنبثقة بعد النقر
        });

        // فتح النافذة المنبثقة
        L.popup()
          .setContent(container)
          .setLatLng(e.latlng)
          .openOn(map);
      });
    }
  });

  console.log(markersArray);

  const geometryType = filteredFeatures[0].geometry.type;
  
  if (geometryType === 'Point' || geometryType === 'Polygon' || geometryType === "MultiPolygon") {
    map.fitBounds(geojsonLayer.getBounds(), {
      padding: [100, 100]
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

