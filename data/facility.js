export const facilities = [{
  id: "cafe",
  image:"../img/cafe-coffee-cup-svgrepo-com.svg",
  title: 'مقهى'
}, {
  id: "restaurant",
  image: "../img/restaurant-svgrepo-com.svg",
  title: 'مطعم'
}, {
  id: "grocery",
  image:"../img/shop-cart-svgrepo-com.svg",
  title: 'بقالة'
}, {
  id: "mosque",
  image:"../img/pray-day-svgrepo-com.svg",
  title: 'مصلى'
}, {
  id: "stadium",
  image:"../img/basketball-svgrepo-com.svg",
  title: 'ملعب كرة السلة'
}, {
  id: "stadium",
  image:"../img/football-svgrepo-com.svg",
  title: 'ملعب كرة القدم'
}, {
  id: "stadium",
  image:"../img/gym-svgrepo-com.svg",
  title: ' الصالة الرياضية'
}, {
  id: "hospital",
  image:"../img/hospital-svgrepo-com.svg",
  title: ' المستشفى الجامعي '
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

