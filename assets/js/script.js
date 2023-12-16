//TO DO
// HOW TO FIX HTML / CSS SO BUTTON IS ON NEXT ROW AND SAME WIDTH AS INPUT BOX
// FIX GAP BETWEEN THE 5 DAY FORECAST DIVS
// When a user clicks on a city in the search history they are again presented with current and future conditions for that city.

$("#search-button").on("click", function (event) {
    event.preventDefault();
    let cityName = $("#search-input").val();
    let currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=87838a9c0968d060b8db54b60caf3669&units=metric";
    let forecastWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=87838a9c0968d060b8db54b60caf3669&units=metric";
    fetch(currentWeatherURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let localUnixTime = data.dt + data.timezone // The UNIX time is based on GMT. The timezone data is the number of seconds away from GMT so needs to be added to the UNIX time to generate the correct local time
        let currentTime = dayjs.unix(localUnixTime).format("dddd DD MMMM HH:mm")
        let currentWeatherDiv = $("<div>").addClass("border border-secondary border-4 rounded-end-pill")
        let currentWeatherIconCode = data.weather[0].icon
        let currentWeatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + currentWeatherIconCode + "@2x.png")
        let currentWeatherHeader = $("<h2>").text(cityName + ", " + data.sys.country + ", " + currentTime)
        let currentWeather = $("<p>").attr("id", "description").text(data.weather[0].description)
        // currentWeather = $("#description").text().charAt(0).toUpperCase() + currentWeather.text().slice(1) // Capitalises first letter
        let currentTemp = $("<p>").text("Temperature: " + data.main.temp + " °C")
        let currentWind = $("<p>").text("Wind Speed: " + data.wind.speed + " metres/second")
        let currentHumidity = $("<p>").text("Humidity: " + data.main.humidity + "%")
        currentWeatherDiv.append(currentWeatherHeader, currentWeatherIcon, currentWeather, currentTemp, currentWind, currentHumidity)
        $("#today").append(currentWeatherDiv)
    })
    fetch(forecastWeatherURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        $("#forecast-header").text("5-day forecast:")
        for (i = 7; i < data.list.length; i += 8) {  // ask Ivan why i + 8 didn't change the value of i so caused an infinite loop
            // i initialised to 7 to get data for tomorrow and 8 is added to ensure the next day is added every time it loops through 
            // Average might be just for the 3 hour period though, so read documentation for how to find out the daily average values.
            let localUnixTime = data.list[i].dt
            let forecastDate = dayjs.unix(localUnixTime).format("DD/MM/YY")
            let forecastWeatherDiv = $("<div>").addClass("col-2 me-4 border border-secondary border-4 rounded")
            // Can't ever seem to get gaps working in Bootstrap so used mx-auto instead but it sends it out of alignment with the header
            let forecastWeatherIconCode = data.list[i].weather[0].icon
            let forecastWeatherIcon = $("<img>").addClass("mx-auto d-block").attr("src", "https://openweathermap.org/img/wn/" + forecastWeatherIconCode + "@2x.png")
            let forecastWeatherHeader = $("<h4>").addClass("text-center").text(forecastDate)
            let forecastWeather = $("<p>").text(data.list[i].weather[0].description)
            let forecastTemp = $("<p>").text("Temp: " + data.list[i].main.temp + " °C")
            let forecastWind = $("<p>").text("Wind: " + data.list[i].wind.speed + " m/s")
            let forecastHumidity = $("<p>").text("Humidity: " + data.list[i].main.humidity + "%")
            forecastWeatherDiv.append(forecastWeatherHeader, forecastWeatherIcon, forecastWeather, forecastTemp, forecastWind, forecastHumidity)
            $("#forecast").append(forecastWeatherDiv)
        }
    })
    localStorage.setItem
})

// NEXT HOW DO I SAVE IT TO LOCAL STORAGE IN THE HISTORY DIV WHEN THE SEARCH BUTTON IS CLICKED AGAIN