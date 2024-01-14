"use strict";
const labelCity = document.getElementById("labelCity");
const searchBtn = document.getElementById("searchBtn");
const today = document.getElementById("today");
const tomorrow = document.getElementById("tomorrow");
const third = document.getElementById("third");
const containerSlides = document.getElementById("allslides");

// display today
let displayWeather = function (data, cityData) {
  let city = cityData;
  let degree = data.temp_c;
  let icon = data.condition.icon;
  let cloud = data.condition.text;
  console.log(icon);
  let rain = data.precip_mm;
  let wind = data.wind_kph;
  let theDate = new Date(data.last_updated);
  let date2 = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    month: "long",
    day: "2-digit",
  }).format(theDate);

  let dataDay = date2.slice(0, date2.indexOf(","));
  let monthDate = date2.slice(date2.indexOf(",") + 1);

  let html = `  <div class="box rounded-2 text-white">
  <div
    class="headBox d-flex justify-content-between pt-2 py-0 px-2 rounded-2"
  >
    <p class="day">${dataDay}</p>
    <p>${monthDate}</p>
  </div>
  <div class="midBox py-4 px-3">
    <p class="city">${city}</p>
    <div  
      class="degree d-flex  align-items-center justify-content-between"
    >
  <p class="d-flex">   ${degree}<span>o</span>C</p>
     <img src="https:${icon}" class="w-100%"> 
    </div>
    <p class="cloud">${cloud}</p>
  </div>
  <div class="bottomBox d-flex justify-content-lg-start ms-3">
    <p class="rain ms-1">
      <i class="fa-solid fa-umbrella"></i> ${rain}%
    </p>
    <p class="wind ms-3">
      <i class="fa-solid fa-wind"></i> ${wind} km/h
    </p>
    <p class=" ms-3">
      <i class="fa-regular fa-compass"> East</i>
    </p>
  </div>
</div>`;
  today.innerHTML = html;
};

function getCurrentWeather() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function currData() {
  try {
    let data = await getCurrentWeather();
    let lat = data.coords?.latitude;
    let lng = data.coords?.longitude;

    let countryName = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=4f0a3828270445698a15a0490b3c8be2`
    );

    let countryData = await countryName.json();

    return countryData.results[0].components.city;
  } catch (err) {
    tomorrow.classList.add("warrning");
    tomorrow.innerHTML = `You need to Search for Country Or allow access to Your Current Location`;
    throw new Error(err);
  }
}
///!=============================================================

(async function () {
  try {
    let cityData = await currData();
    let weatherToday = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=a629727795254be0b79155312241301&q=${cityData}&days=7`
    );
    if (!weatherToday.ok) {
      throw new Error("there is a proplem in getting data");
    }
    let dataToday = await weatherToday.json();
    console.log(dataToday);
    console.log(dataToday.current);
    displayWeather(dataToday.current, cityData);
    displayOtherDays(dataToday.forecast.forecastday[1], tomorrow);
    displayOtherDays(dataToday.forecast.forecastday[2], third);
  } catch (er) {
    console.log(er);
  }
})();

///!=============================================================

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  today.classList.remove("d-none");
  third.classList.remove("d-none");
  tomorrow.classList.remove("warrning");
  let cityName = labelCity.value;
  getWeather(cityName);
});

function displayOtherDays(notAllData, docu) {
  let data = notAllData.day;
  let degree = data.avgtemp_c;
  let icon = data.condition.icon;

  let cloud = data.condition.text;
  let theDate = new Date(notAllData.date);
  let date2 = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    month: "long",
    day: "2-digit",
  }).format(theDate);

  let dataDay = date2.slice(0, date2.indexOf(","));

  let html = `  <div class="box rounded-2 text-white">
  <div
    class="headBox d-flex justify-content-center pt-2 py-0 px-2 rounded-2 "
  >
    <p class="day">${dataDay}</p>
  </div>
  <div class="midBox py-4 px-3">
  
    <div  
      class="degree d-flex flex-column align-items-center justify-content-between"
    >
    <img src="https:${icon}" class="w-100%">
  <p class="d-flex">   ${degree}<span>o</span>C</p>

  <p class="cloud">${cloud}</p>

    </div>
  </div>

</div>`;
  console.log(html);
  docu.innerHTML = html;
}
async function getWeather(city) {
  try {
    let weatherDate = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=a629727795254be0b79155312241301&q=${city}&days=7`
    );
    if (!weatherDate.ok) {
      throw new Error(
        `there is no country with this name please Fix the name `
      );
    }
    let dataWe = await weatherDate.json();

    displayWeather(dataWe.current, city);

    displayOtherDays(dataWe.forecast.forecastday[1], tomorrow);
    displayOtherDays(dataWe.forecast.forecastday[2], third);
  } catch (e) {
    today.classList.add("d-none");
    third.classList.add("d-none");
    tomorrow.classList.add("warrning");
    tomorrow.innerHTML = e.message;
  }
}
