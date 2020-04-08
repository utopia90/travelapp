const submitBtn = document.getElementById("submit");
const inputs = document.getElementById("main-form").elements;
const placeInput = inputs["place"];
const arriveInput = inputs["trip-start"];
const departInput = inputs["trip-end"];
const inputBar = document.getElementById("todo-input-bar");
const addBtn = document.getElementById("add-todo-btn");
const uList = document.getElementById("todo-list");
const placeCity = document.getElementById("city-name");
const mainPage = document.getElementById("main-page");
const userAccount = document.getElementById("user-account");
const hotelBtn = document.getElementById("hotels-btn");
const restaurantBtn = document.getElementById("restaurants-btn");
const thingstodoBtn = document.getElementById("thingstodo-btn");
const monumentsBtn = document.getElementById("monuments-btn");
const showInfo = document.getElementById("show-info");
const cityBoxesBtn = Array.from(document.getElementsByClassName("box"));
const closeBar = document.getElementById("close-bar");
const showInfoDiv = document.getElementById("showInfoDiv");
const firstDay = document.getElementById("initial-weather");
const finalDay = document.getElementById("final-weather");

const api = {
  key: "bc5968f4b239943f185627ac83619ed6",
  baseurl: "https://api.openweathermap.org/data/2.5/",
};

document.addEventListener("DOMContentLoaded", function () {
  eventListeners();
});

function eventListeners() {
  addBtn.addEventListener("click", () => {
    startFunction();
  });

  inputBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      startFunction();
    }
  });

  uList.addEventListener("click", function (event) {
    if (event.target.classList.contains("done-btn")) {
      tickFromList(event.target);
    } else if (event.target.classList.contains("delete-btn")) {
      deleteFromList(event.target);
    }
  });

  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    placeCity.innerText = placeInput.value;
    mainPage.classList.add("hide");
    userAccount.classList.remove("hide");
    document.body.style.backgroundImage = "url(./img/travel.jpg)";

    getResults(placeInput.value, arriveInput.value, departInput.value);
    resetForm();
  });

  //  weather forecast api

  function getResults(query) {
    fetch(`${api.baseurl}forecast?q=${query}&units=metric&APPID=${api.key}`)
      .then((forecast) => {
        return forecast.json();
      })
      .then(displayForecast);
  }
  function displayForecast(forecast) {
    let city = placeInput.value;
    let arr = forecast.list;
    // first day
    let obj = arr.find((o) => o.dt_txt.includes("15:00:00"));
    // date
    const initialDate = document.createElement("P");
    initialDate.innerText = arriveInput.value;
    firstDay.appendChild(initialDate);

    // icon
    let firstIconCode = obj.weather[0].icon;
    let firstDayWeatherDescription = obj.weather[0].description;
    const img = document.createElement("IMG");
    img.src = "http://openweathermap.org/img/w/" + firstIconCode + ".png";
    img.alt = firstDayWeatherDescription;
    firstDay.appendChild(img);

    // temperature
    const initialTemp = document.createElement("H3");
    let firstDayTemperature = `${Math.round(obj.main.temp)} C`;
    initialTemp.innerText = firstDayTemperature;
    firstDay.appendChild(initialTemp);

    // weather description
    const firstDayWeather = document.createElement("H4");
    firstDayWeather.innerText = firstDayWeatherDescription;
    firstDay.appendChild(firstDayWeather);

    // last day
    let listOfDays = arr.filter((elem) => elem.dt_txt.includes("15:00:00"));
    let lastDay = listOfDays.length - 1;

    // date
    const lastDate = document.createElement("P");
    lastDate.innerText = departInput.value;
    finalDay.appendChild(lastDate);

    // icon
    let lastIconCode = listOfDays[lastDay].weather[0].icon;
    let lastDayWeatherDescription = listOfDays[lastDay].weather[0].description;
    const finalDayImg = document.createElement("IMG");
    finalDayImg.src =
      "http://openweathermap.org/img/w/" + lastIconCode + ".png";
    console.log(lastIconCode);
    finalDayImg.alt = lastDayWeatherDescription;
    finalDay.appendChild(finalDayImg);

    // temperature
    let finalTemp = document.createElement("H3");
    const lastDayTemp = `${Math.round(listOfDays[lastDay].main.temp)} C`;
    console.log(lastDayTemp);
    finalTemp.innerText = lastDayTemp;
    finalDay.appendChild(finalTemp);

    // description
    let lastDayWeather = document.createElement("H4");
    lastDayWeather.innerText = lastDayWeatherDescription;
    finalDay.append(lastDayWeather);
  }

  function resetForm() {
    inputs.reset();
  }

  cityBoxesBtn.forEach((box) =>
    box.addEventListener("click", (e) => {
      showInfoDiv.classList.remove("hide");

      if (e.target.value === "thingstodo") {
        showInfo.innerHTML = `
      <iframe id="thingstodo-frame"
      width="1200"
      height="700"
      src="https://foursquare.com/explore?cat=arts&mode=url&near=${placeInput.value}">
      </iframe>`;
      } else if (e.target.value === "restaurants") {
        showInfo.innerHTML = `
      <iframe id="restaurants-frame"
      width="1200"
      height="700"
      src="https://foursquare.com/explore?cat=food&mode=url&near=${placeInput.value}">
    </iframe>`;
      } else if (e.target.value === "monuments") {
        showInfo.innerHTML = `
      <iframe id="monuments-frame"
      width="1200"
      height="700"
      src="https://foursquare.com/explore?mode=url&near=${placeInput.value}&q=Monument">
    </iframe>`;
      } else if (e.target.value === "hotels") {
        showInfo.innerHTML = `
      <iframe id="hotels-frame"
      width="1200"
      height="700"
      src="https://foursquare.com/explore?mode=url&near=${placeInput.value}&q=Hotel">
    </iframe>`;
      }
    })
  );

  closeBar.addEventListener("click", () => {
    showInfoDiv.classList.add("hide");
  });
}

function startFunction() {
  let inputBarValue = inputBar.value;
  if (inputBarValue.length > 0) {
    addToList(inputBarValue);
  }
}

function addToList(inputBarValue) {
  let itemText = document.createElement("li");
  itemText.innerHTML = `<li class='todo'>${inputBarValue}
  <button class='done-btn'>✓</button>
  <button class='delete-btn'>x</button>
  </li>`;
  uList.appendChild(itemText);
  inputBar.value = "";
}

function tickFromList(element) {
  let parent = element.parentElement;
  if (parent.classList.contains("done")) {
    parent.classList.remove("done");
  } else {
    parent.classList.add("done");
  }
}

function deleteFromList(e) {
  let parent = e.parentElement.parentElement;
  uList.removeChild(parent);
}
