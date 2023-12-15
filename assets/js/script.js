//TO DO
// HOW TO FIX HTML / CSS SO BUTTON IS ON NEXT ROW AND SAME WIDTH AS INPUT BOX
// Create a weather dashboard with form inputs.
// When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history.
// When a user views the current weather conditions for that city they are presented with:
// The city name - city.name OR $("#search-input").val()
// The date - list[0].dt_txt
// An icon representation of weather conditions - list[0].weather[0].icon
// The temperature - list[0].main.temp
// The humidity - list[0].main.humidity is humidity in the current next 3 hr slot
// The wind speed - list[0].wind.speed

// When a user views future weather conditions for that city they are presented with a 5-day forecast that displays:
// The date
// An icon representation of weather conditions
// The temperature
// The humidity
// When a user clicks on a city in the search history they are again presented with current and future conditions for that city.

//list[0] is midnight, [1] is 3am, [2] is 6am etc. 5 day, 3 hour forecast data starting from next 3rd hour slot

$("#search-button").on("click", function (event) {
    event.preventDefault();
    let cityName = $("#search-input").val();
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=87838a9c0968d060b8db54b60caf3669&units=metric";
    fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        let todayDate = dayjs(data.list[0].dt_txt).format('DD/MM/YYYY')
        //The first entry is midnight of the next day, it isn't technically the current time - how do I do that?
        //Check again tomorrow and see if it is still midnight the next day, or just set to the next 3rd hour slot
        let todayDiv = $("<div>")
        let weatherIcon = data.list[0].weather[0].icon
        let todayIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png")
        let todayHeader = $("<h2>").text(cityName + ", " + data.city.country + " " + todayDate)
        let todayTemp = $("<p>").text("Temperature: " + data.list[0].main.temp + " °C")
        let todayWind = $("<p>").text("Wind Speed: " + data.list[0].wind.speed + " IN METRES/SEC")
        let todayHumidity = $("<p>").text("Humidity: " + data.list[0].main.humidity + "%")
        todayDiv.append(todayHeader, todayIcon, todayTemp, todayWind, todayHumidity)
        $("#today").append(todayDiv)
    });
    // then do a for loop iterating through the entire array of the next 5 days worth of data
})