// WAYS TO IMPROVE
// - VALIDATION - IF USER DOESN'T ENTER A CITY A MODAL / ALERT SAYS "CITY NOT FOUND"  THE BELOW WORKS BUT BREAKS EVERYTHING IF IT PUT IT IN
// - SHOW AVERAGE TEMPS, NOT JUST THE TEMPERATURE FOR THAT 3 HOUR PERIOD ON THAT DAY
// - THE NUMBER OF CITIES GETS INFINITELY LONG - REACH A POINT WHERE THE  OLDEST AUTOMATICALLY DELETES

// This code block ensures search history buttons are recreated when the page refreshes. It loops through the local storage and targets all keys with :forecast in the key name, it then prints the button
for (let key in localStorage){
    if(key.indexOf(":forecast") !== -1) {
        printButtonToHistory(key.replace(":forecast", "")) // replaces the forecast with an empty string, so the key is now just the city name
    }
}

// This code block is the logic for the search button. API data is fetched, the current forecast and 5 day-forecast are printed and a search history button is created if that city hasn't already been searched for
$("#search-button").on("click", function (event) {
    event.preventDefault();
    let cityName = $("#search-input").val();
    let currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?appid=87838a9c0968d060b8db54b60caf3669&units=metric&q=" + cityName;
    let forecastWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?appid=87838a9c0968d060b8db54b60caf3669&units=metricc&q=" + cityName;
    let cityDoesNotExistInLocalstorage = localStorage.getItem(cityName + ":forecast") === null; // A boolean that assigns true if the city doesn't exist in local storage
    fetch(currentWeatherURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        localStorage.setItem(cityName + ":currentWeather", JSON.stringify(data)) // Saves the searched citie's current weather to local storage
    })

    fetch(forecastWeatherURL)
    .then(function (response) {
        return response.json();
    })

    .then(function (data) {
        console.log(data)
        localStorage.setItem(cityName + ":forecast", JSON.stringify(data)) // Saves the searched citie's 5-day forecast to local storage
    })
    // This code block calls functions created in the logic below, essentially printing all data to the screen and creating search history buttons if they don't already exist
    .then(function () {
        printDataToScreen(cityName)
        if(cityDoesNotExistInLocalstorage) {
            printButtonToHistory(cityName);
        }

    })

})

// This function first codes the logic for the search history button i.e. when it is clicked the data is printed to the screen. It then appends it to the search history area of the web page
function printButtonToHistory(cityName) {
    let button = $("<button>").addClass("mb-3").text(cityName).on("click", function() {
        printDataToScreen(cityName)
    })
    $("#history").append(button)
}

// This creates the clear history button, which clears the local storage and deletes all weather information on the screen if clicked 
$("#clear").on("click", function() {
    localStorage.clear()
    $(".forecast").html("")
    $("#history").html("")
})

// This function is getting data from the local storage and printing it to the screen, using the functions created below it
function printDataToScreen(cityName){
    printCurrentWeather(cityName, JSON.parse(localStorage.getItem(cityName + ":currentWeather")))
    printForecast(JSON.parse(localStorage.getItem(cityName + ":forecast")))
}

// This function prints the current weather to the screen and creates the HTML dynamically
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

// This function prints the 5-day forecast to the screen and creates the HTML dynamically
function printForecast(data) {
    $("#forecast").html("")
    $("#forecast-header").text("5-day forecast:")
    console.log(data.list)
    for (i = 7; i < data.list.length; i += 8) {
        // i initialised to 7 to get the 7th key value pair in the array, this is tomorrow's data. Then 8 is added to ensure the next set of data grabbed is 24 hours later (8 x 3hrs = 24hrs)
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