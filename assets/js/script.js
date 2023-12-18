// TO DO - readme and comment the code

// WAYS TO IMPROVE
// - VALIDATION - IF USER DOESN'T ENTER A CITY A MODAL / ALERT SAYS "CITY NOT FOUND"  THE BELOW WORKS BUT BREAKS EVERYTHING IF IT PUT IT IN
// if (data.message) {
//         alert("City not found")
//     }
// - SHOW AVERAGE TEMPS, NOT JUST THE TEMPERATURE FOR THAT 3 HOUR PERIOD ON THAT DAY
// - THE NUMBER OF CITIES GETS INFINITELY LONG - REACH A POINT WHERE THE  OLDEST AUTOMATICALLY DELETES

for (let key in localStorage){
    if(key.indexOf(":forecast") !== -1) {
        printButtonToHistory(key.replace(":forecast", ""))
    }
 }

$("#search-button").on("click", function (event) {
    event.preventDefault();
    let cityName = $("#search-input").val();
    let currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?appid=87838a9c0968d060b8db54b60caf3669&units=metric&q=" + cityName;
    let forecastWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?appid=87838a9c0968d060b8db54b60caf3669&units=metricc&q=" + cityName;
    let cityDoesNotExistInLocalstorage = localStorage.getItem(cityName + ":forecast") === null;
    fetch(currentWeatherURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        localStorage.setItem(cityName + ":currentWeather", JSON.stringify(data))
    })

    fetch(forecastWeatherURL)
    .then(function (response) {
        return response.json();
    })

    .then(function (data) {
        localStorage.setItem(cityName + ":forecast", JSON.stringify(data))
    })

    printDataToScreen(cityName);
    if(cityDoesNotExistInLocalstorage)
        printButtonToHistory(cityName);
})

function printButtonToHistory(cityName) {
    let button = $("<button>").addClass("mb-3").text(cityName).on("click", function() {
        printDataToScreen(cityName)
    })
    $("#history").append(button)
}

$("#clear").on("click", function() {
    localStorage.clear()
    $(".forecast").html("")
})

function printDataToScreen(cityName){
    printCurrentWeather(cityName, JSON.parse(localStorage.getItem(cityName + ":currentWeather")))
    printForecast(JSON.parse(localStorage.getItem(cityName + ":forecast")))
}

function printCurrentWeather(cityName, data) {
    let localUnixTime = data.dt + data.timezone // The UNIX time is based on GMT. The timezone data is the number of seconds away from GMT so needs to be added to the UNIX time to generate the correct local time
    let currentTime = dayjs.unix(localUnixTime).format("dddd DD MMMM HH:mm")
    let currentWeatherDiv = $("<div>").addClass("border border-secondary border-4 rounded-end-pill")
    let currentWeatherHeader = $("<h2>").text(cityName + ", " + data.sys.country + ", " + currentTime)
    let currentWeatherIconCode = data.weather[0].icon
    let currentWeatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + currentWeatherIconCode + "@2x.png")
    let currentWeather = $("<p>").addClass("description").text(data.weather[0].description)
    let currentTemp = $("<p>").text("Temperature: " + data.main.temp + " °C")
    let currentWind = $("<p>").text("Wind Speed: " + data.wind.speed + " metres/second")
    let currentHumidity = $("<p>").text("Humidity: " + data.main.humidity + "%")
    currentWeatherDiv.append(currentWeatherHeader, currentWeatherIcon, currentWeather, currentTemp, currentWind, currentHumidity)
    $("#today").html(currentWeatherDiv)
}
function printForecast(data) {
    $("#forecast").html("")
    $("#forecast-header").text("5-day forecast:")
    for (i = 7; i < data.list.length; i += 8) {
        // i initialised to 7 to get data for tomorrow and 8 is added to ensure the next day is added every time it loops through 
        // Average might be just for the 3 hour period though, so read documentation for how to find out the daily average values.
        let forecastWeatherDiv = $("<div>").addClass("col-2 me-4 border border-secondary border-4 rounded")
        let localUnixTime = data.list[i].dt
        let forecastDate = dayjs.unix(localUnixTime).format("DD/MM/YY")
        let forecastWeatherHeader = $("<h4>").addClass("text-center").text(forecastDate)
        let forecastWeatherIconCode = data.list[i].weather[0].icon
        let forecastWeatherIcon = $("<img>").addClass("mx-auto d-block").attr("src", "https://openweathermap.org/img/wn/" + forecastWeatherIconCode + "@2x.png")
        let forecastWeather = $("<p>").addClass("description").text(data.list[i].weather[0].description)
        let forecastTemp = $("<p>").text("Temp: " + data.list[i].main.temp + " °C")
        let forecastWind = $("<p>").text("Wind: " + data.list[i].wind.speed + " m/s")
        let forecastHumidity = $("<p>").text("Humidity: " + data.list[i].main.humidity + "%")
        forecastWeatherDiv.append(forecastWeatherHeader, forecastWeatherIcon, forecastWeather, forecastTemp, forecastWind, forecastHumidity)
        $("#forecast").append(forecastWeatherDiv)
    }
}