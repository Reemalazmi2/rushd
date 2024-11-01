import { map } from './map.js';

// دالة الحصول على موقع المستخدم
export function userlocation() {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        const marker = L.marker([userLat, userLon]).addTo(map);
        marker.bindPopup('انت هنا').openPopup();

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

// للرجوع لموقع العميل عند الضغط
document.getElementById('findMe').addEventListener('click', () => {
  userlocation();
});

let currentRoute;

// التوجية
export function routeToDestination(userLat, userLon, destinationLat, destinationLon) {
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
      router: L.Routing.mapbox('pk.eyJ1IjoicmVlbWFsYXptaSIsImEiOiJjbTJqZ2lvM3gwNTM2Mm1yMWdxY3Q5YThkIn0.VtsPhjheCaixoSNbnk2siw', {
        // طريقة التنقل: المشي
        profile: 'mapbox/walking'
       
      })
      
    }).addTo(map);
}


// اخذ احداثيات التوجية
export function routing(selectedFeature) {
  let shapes = []; 

  if (selectedFeature) {
    const geometry = selectedFeature.geometry;
    const properties = selectedFeature.properties;

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
        const coordinates = geometry.coordinates[0]; 

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
            coordinates: coordinates 
        });
    }
      
  }

  // إضافة العلامات لكل نقطة أو مضلع
    shapes.forEach(shape => {
        const coord = { lat: shape.lat, lon: shape.lon }; // الحصول على الإحداثيات

        if (shape.type === 'Point') {
            const marker = L.marker([coord.lat, coord.lon]).addTo(map);

            userlocation().then((userCoords) => {
                routeToDestination(userCoords.lat, userCoords.lon, coord.lat, coord.lon);
            });

        } else if (shape.type === 'Polygon') {
        if (shape.coordinates && shape.coordinates.length > 0) { 

            const latLngs = shape.coordinates.map(coord => [coord[1], coord[0]]);
            const polygon = L.polygon(latLngs).addTo(map);

            userlocation().then((userCoords) => {
                routeToDestination(userCoords.lat, userCoords.lon, coord.lat, coord.lon);
            });
        } else {
            console.warn('Polygon has no coordinates:', shape);
        }
    }
    });

}