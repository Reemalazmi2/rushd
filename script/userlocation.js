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
        alert(`لا يمكن الوصول لموقعك
          الرجاء التأكد من تفعيل الوصول للموقع من الاعدادات`);
    });
  }
}

userlocation();

document.getElementById('findMe').addEventListener('click', () => {
  userlocation();
});
