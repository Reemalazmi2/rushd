export const facilities = [{
  id: "cafe",
  image:"./img/coffee-cup-coffee-svgrepo-com.png",
  title: 'مقهى'
}, {
  id: "restaurant",
  image: "./img/restaurant-svgrepo-com.png",
  title: 'مطعم'
}, {
  id: "grocery",
  image:"./img/grocery-trolley-svgrepo-com.png",
  title: 'بقالة'
}, {
  id: "mosque",
  image:"../img/mosque-islam-svgrepo-com.png",
  title: 'مصلى'
}, {
  id: "breakRoom",
  image:"./img/rest-area-picnic-svgrepo-com.png",
  title: ' استراحة طالبات '
}, {
  id: "hospital",
  image:"../img/hospital-medical-nurse-svgrepo-com.png",
  title: ' العيادة الجامعي '
}]

function renderFacility() {
  let facilityHTML = '';

  facilities.forEach((facility) => {
    facilityHTML += `
      <button class="facility-button js-look-for-facility" data-facility-id="${facility.id}">
          <img class="facility-icon" src=${facility.image}>
          <div class="icon-title">
              ${facility.title}
          </div>
      </button>
    `;
  });

  document.querySelector('.js-bottom-section')
    .innerHTML = facilityHTML;
}

renderFacility();

