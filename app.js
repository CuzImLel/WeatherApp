const form = document.getElementById('searchbar');
const searchbar = document.getElementById('search');
const locationElement = document.getElementById('location');
const temperature = document.getElementById('temperature');
const state = document.getElementById('state');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const config = require('./config.json');
const appid = config.apikey
const hours = document.querySelectorAll('#hour');
const list2 = document.querySelectorAll('#degrees');
const icons = document.querySelectorAll('#icon');

let start = () => {
    update("usa")
}

start()

form.addEventListener('submit', function(event) {
    event.preventDefault();
    let country = searchbar.value;
    update(country)
   
});


function returnURL(country) {
    return "https://api.openweathermap.org/data/2.5/weather?q=" + country + "&units=metric&appid=" + appid
}

function returnForecastURL(country) {
    return "http://api.openweathermap.org/data/2.5/forecast?q=" + country + "&units=metric&appid=" + appid
}

async function apicall(name) {
    const response = await fetch(returnURL(name));
    const value = await response.json()
    return value;
}

async function apicallForecast(name) {
    const response = await fetch(returnForecastURL(name));
    const value = await response.json()
    return value;
}



async function update(country) {
    const value = await apicall(country)
    locationElement.innerHTML = value.name;
    temperature.innerHTML = Math.round(value.main.temp) + "°";
    state.innerHTML = value.weather[0].description;
    humidity.innerHTML = value.main.humidity + "%"
    wind.innerHTML = Math.round(value.wind.speed * 3.6) + " km/h"
    visibility.innerHTML = (value.visibility) / 1000 + " km"
    pressure.innerHTML = value.main.pressure + " hPa"
    let data = await apicallForecast(country);
    for (i = 1; i < hours.length; i++) {
        hours[i].innerHTML = getTimeByTimezone(value.timezone,i*3)
    }
    for (i = 0; i < list2.length; i++) {
        list2[i].innerHTML = Math.round(data.list[i].main.temp) + "°C";
        switch(getState(data,i)) {
            case "Clear":
            icons[i].innerHTML = "sunny"
            icons[i].style.color = "yellow"
            break;
            case "Clouds":
            icons[i].innerHTML = "cloud"
            icons[i].style.color = "white"
            break;
            case "Rain":
            icons[i].innerHTML = "rainy"
            icons[i].style.color = "lightgray"
            break;
            case "Drizzle":
            icons[i].innerHTML = "weather_mix"
            icons[i].style.color = "lightgray"
            break;
            case "Thunderstorm":
            icons[i].innerHTML = "thunderstorm"
            icons[i].style.color = "gray"
            break;
            case "Snow":
            icons[i].innerHTML = "ac_unit"
            icons[i].style.color = "white"
            break;
            case "Mist":
            icons[i].innerHTML = "mist"
            icons[i].style.color = "white"
            break;
            case "Fog":
            icons[i].innerHTML = "mist"
            icons[i].style.color = "white"
            break;
        }
    }

   

}

function getTimeByTimezone(timezone, houradder) {
    const date = new Date();
    const utcOffsetMinutes = date.getTimezoneOffset();
    const timezoneOffsetMinutes = timezone / 60;
    const totalOffsetMinutes = utcOffsetMinutes + timezoneOffsetMinutes;
  
    const currentTime = new Date(date.getTime() + totalOffsetMinutes * 60000);
    let hours = currentTime.getHours() + houradder;
   
    if (hours >= 24) {
        const adder = hours - 24;
        hours = 0 + adder
    }


    const minutes = currentTime.getMinutes();

  
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
  
    const timeString = `${formattedHours}:${formattedMinutes}`;
  
    return timeString;
}

function getState(data,i) {
    return data.list[i].weather[0].main
}