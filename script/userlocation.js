import { map } from './map.js';


function userlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // تعيين موقع المستخدم على الخريطة
        const userMarker = L.marker([lat, lon]).addTo(map);
        userMarker.bindPopup('You are here!').openPopup();

        // تحريك الخريطة إلى موقع المستخدم
        map.setView([lat, lon], 13);
    }, () => {
        alert('Unable to retrieve your location.');
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

userlocation();

document.getElementById('findMe').addEventListener('click', () => {
  userlocation();
});
