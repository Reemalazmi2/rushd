import { map } from './map.js';


export function userlocation() {
  return new Promise((resolve) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        // تعيين موقع المستخدم على الخريطة
        const marker = L.marker([userLat, userLon]).addTo(map);
        marker.bindPopup('You are here!').openPopup();

        // تحريك الخريطة إلى موقع المستخدم
        map.setView([userLat, userLon], 16);

        resolve({ lat: userLat, lon: userLon });
    }, () => {
        alert(`لا يمكن الوصول لموقعك
          الرجاء التأكد من تفعيل الوصول للموقع من الاعدادات`);
    });
  }
  })
}
userlocation();

document.getElementById('findMe').addEventListener('click', () => {
  userlocation();
});

//routing//////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////
let currentRoute;

function routeToDestination(userLat, userLon, destinationLat, destinationLon) {

  if (currentRoute) {
    map.removeControl(currentRoute);
  }

  currentRoute = L.Routing.control({
    waypoints: [
        L.latLng(userLat, userLon),
        L.latLng(destinationLat, destinationLon)
    ],
    routeWhileDragging: true,
    geocoder: L.Control.Geocoder.nominatim(),
    createMarker: function() { return null; }, // لا تستخدم علامات للمسار
    router: new L.Routing.OSRMv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1/'
    })
  }).addTo(map);
}


export function routing(filteredFeatures) {
  let shapes = []; // مصفوفة لتخزين النقاط أو المضلعات

  // تحقق من طول filteredFeatures
  if (filteredFeatures.length > 0) {
      filteredFeatures.forEach(feature => {
          const geometry = feature.geometry;
          const properties = feature.properties;

          if (geometry.type === 'Point') {
              const id = properties.id;
              const facilityLat = geometry.coordinates[1];
              const facilityLon = geometry.coordinates[0];

              shapes.push({
                  lat: facilityLat,
                  lon: facilityLon,
                  type: 'Point',
                  id: id
              });
          } else if (geometry.type === 'Polygon') {
              const id = properties.id;
              const coordinates = geometry.coordinates[0]; // الزوايا الأولى من المضلع

              // حساب نقطة الوسط
              const center = coordinates.reduce((acc, coord) => {
                  acc.lat += coord[1];
                  acc.lon += coord[0];
                  return acc;
              }, { lat: 0, lon: 0 });

              const numCoords = coordinates.length;
              shapes.push({
                  lat: center.lat / numCoords,
                  lon: center.lon / numCoords,
                  type: 'Polygon',
                  id: id, 
                  coordinates: coordinates // تأكد من إضافة الإحداثيات هنا
              });
          }
      });
  }

  console.log(shapes);

  // إضافة العلامات لكل نقطة أو مضلع
  shapes.forEach(shape => {
      const coord = { lat: shape.lat, lon: shape.lon }; // الحصول على الإحداثيات

      if (shape.type === 'Point') {
          const marker = L.marker([coord.lat, coord.lon]).addTo(map);

          marker.on('click', () => {
              userlocation().then((userCoords) => {
                  routeToDestination(userCoords.lat, userCoords.lon, coord.lat, coord.lon);
              }).catch((error) => {
                  alert(error.message);
              });
          });
      } else if (shape.type === 'Polygon') {
        if (shape.coordinates && shape.coordinates.length > 0) { // تحقق من وجود الإحداثيات
            // تأكد من أن الإحداثيات صحيحة
            const latLngs = shape.coordinates.map(coord => [coord[1], coord[0]]);
    
            const polygon = L.polygon(latLngs).addTo(map);
            polygon.bindPopup('Polygon Area').openPopup();
    
            polygon.on('click', () => {
                userlocation().then((userCoords) => {
                    routeToDestination(userCoords.lat, userCoords.lon, coord.lat, coord.lon);
                }).catch((error) => {
                    alert(error.message);
                });
            });
        } else {
            console.warn('Polygon has no coordinates:', shape);
        }
    }
  });
}



///////////////////////////////////////////////////////////////////////////////////////////////

