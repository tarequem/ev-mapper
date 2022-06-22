// select elements

var usrFormEl = document.querySelector(".usr-select")
var inputEl = document.querySelector(".text-input");
var searchButtonEl = document.querySelector("#search-station");
var displayStationEl = document.querySelector(".location-list");
var popUpEl = document.querySelector("#pop-up");
var alertMessageEl = document.querySelector("#alert-message");
var closePopUpBtn = document.querySelector("#close-btn");
var pwrLocationEl = document.querySelector(".pwr-location");
var mapEl = document.querySelector(".map");
var weatherInfoEl = document.querySelector(".wth-info");
var weatherEl = document.querySelector(".weather");
var listEl = document.querySelector("#charger-list");

//An array of lat and long coordinates to be used by the map api
var mapArray = [];

// Get zipcode or postal code
var zipOrpostal = function () {
    // to check if the input is valid postal code format
    var location = inputEl.value.trim().replace(/\s+/g, '').toLowerCase();
    var regEx = /^(\d{5}(-\d{4})?|[a-z]\d[a-z]\d[a-z]\d)$/;
    // console.log(location);

    //saving last city in local storage
    localStorage.setItem('lastCity', JSON.stringify(location));

    if (!regEx.test(location)) {
        alertMessageEl.textContent = "Please enter a valid postal code in US or Canada";
        popUpEl.style.display = "block"
    } else {
        pwrLocationEl.classList.remove("hide")
        listEl.classList.remove("hide")
        weatherInfoEl.classList.remove("hide")
        //fetch data with location info
        fetch("https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?fuel_type=all&location=" + location + "&limit=3&radius=infinite&api_key=SwEWgqT1Snyw7Pp3sxyGmCNlQ5okceAAFKUr5PTU")
            .then(function (response) {

                if (response.ok) {

                    response.json().then(function (data) {
                        //  console.log(data);

                        //populate the mapArray with locations
                        for (var i = 0; i < data.fuel_stations.length; i++) {

                            // get location data
                            var mapCoordinates = {
                                lat: data['fuel_stations'][i]['latitude'],
                                lon: data['fuel_stations'][i]['longitude'],
                            };
                            //create an array of coordinates for the map
                            mapArray.push(mapCoordinates);

                            //grab station details

                            var station = {
                                ev_network: data['fuel_stations'][i]['ev_network'],
                                ev_connector_types: data['fuel_stations'][i]['ev_connector_types'],
                                distance: data['fuel_stations'][i]['distance_km'],
                                address: data['fuel_stations'][i]['station_name'],
                                // zip: data['fuel_stations'][i]['zip'],
                                phone: data['fuel_stations'][i]['station_phone'],
                                access: data['fuel_stations'][i]['access_code'],
                                accessHours: data['fuel_stations'][i]['access_days_time']
                            }

                            //fetch weather data
                            var apiUrl = "https:api.openweathermap.org/data/2.5/weather?&units=metric&lat=" + mapCoordinates.lat + "&lon=" + mapCoordinates.lon + "&appid=220ff34db8df0fb665355972020ec55c";

                            //variables for weather
                            var tempEl = document.querySelector("#temp");
                            var descEl = document.querySelector("#description");
                            var iconEl = document.querySelector("#icon");


                            fetch(apiUrl)
                                .then(response => response.json())
                                .then(data => {
                                    var tempData = data['main']['temp'];
                                    var descData = data['weather'][0]['description'];
                                    var icon = data['weather'][0]['icon']

                                    //fetch weather icon
                                    var iconUrl = "<img class='weather-icon'  src= 'https://openweathermap.org/img/wn/" + icon + "@2x.png' />"

                                    //fill elements with fetched weather data
                                    iconEl.innerHTML = iconUrl;
                                    tempEl.innerHTML = tempData;
                                    descEl.innerHTML = descData;
                                    // console.log(data);
                                })


                            //  console.log(station.ev_network, station.ev_connector_types, station.distance,
                            //      station.address, station.zip, station.phone, station.access, station.accessHours);

                            //create elements and add content
                            var stationCard = document.createElement('div');
                            stationCard.classList.add("station-info");

                            var stationNumber = document.createElement("p");
                            stationNumber.innerHTML = "Station " + (i + 1);

                            var stationDetailNetwork = document.createElement('p');
                            stationDetailNetwork.innerHTML = `EV Network: ${station.ev_network}`;

                            var stationDetailConnectorType = document.createElement('p');
                            stationDetailConnectorType.innerHTML = `EV Connector Type: ${station.ev_connector_types}`;

                            var stationDetailDistance = document.createElement('p');
                            stationDetailDistance.innerHTML = `Station is ${Math.round(station.distance * 100) / 100} km away`;

                            var stationDetailAddress = document.createElement('p');
                            stationDetailAddress.innerHTML = `Station address: ${station.address}`;

                            // var stationDetailZip = document.createElement('p');
                            // stationDetailZip.innerHTML = `Zip: ${station.zip}`;

                            var stationDetailPhone = document.createElement('p');
                            stationDetailPhone.innerHTML = `Phone: ${station.phone}`;

                            var stationDetailAccess = document.createElement('p');
                            stationDetailAccess.innerHTML = `Access: ${station.access}`;

                            var stationDetailAccessHours = document.createElement('p');
                            stationDetailAccessHours.innerHTML = `Access Hours: ${station.access}`;

                            //add details to card
                            stationCard.appendChild(stationNumber);
                            stationCard.appendChild(stationDetailNetwork);
                            stationCard.appendChild(stationDetailConnectorType);
                            stationCard.appendChild(stationDetailDistance);
                            stationCard.appendChild(stationDetailAddress);
                            // stationCard.appendChild(stationDetailZip);
                            stationCard.appendChild(stationDetailPhone);
                            stationCard.appendChild(stationDetailAccess);
                            stationCard.appendChild(stationDetailAccessHours);


                            //add card to station details div
                            displayStationEl.appendChild(stationCard);
                            // display map image
                            mapDisplay(data);
                        }

                    })
                } else {
                    alertMessageEl.textContent = "Something Went Wrong. Please check your postal code and try again.";
                    popUpEl.style.display = "block";
                }
            }) // end function response
            .catch(function (error) {
                alertMessageEl.textContent = "Can't connect to stations server at this moment. Please try again later."
                popUpEl.style.display = "block"
            })
    }
};

var mapDisplay = function (data) {
    // decide the map size based on the size of the container
    var mapHeight = pwrLocationEl.clientHeight;
    var mapWidth = pwrLocationEl.clientWidth;
    var pins = "";
    var lastIndex = data.fuel_stations.length - 1;
    for (var i = 0; i < lastIndex + 1; i++) {
        pins += "&pp=" + data.fuel_stations[i].latitude + "," + data.fuel_stations[i].longitude + ";;" + (i + 1);
    }

    // determine the map zoom level based on the furthest distance
    var zoomLevel = 0;
    if (data.fuel_stations[lastIndex].distance_km < 1) {
        zoomLevel = 15;
    } else if (data.fuel_stations[lastIndex].distance_km > 10) {
        zoomLevel = 10;
    } else {
        zoomLevel = 12;
    };

    var bingApiKey = "AnO6fiHuYXo2eMuSlm4xXNKmQZI4_lcJu8YfTc3Y-Lh8eEMdlqJrVr1DOOb_odQ6";

    var apiUrl = "https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/" + data.latitude + "," + data.longitude + "/" + zoomLevel + "?mapSize=" + mapWidth + "," + mapHeight + pins + "&key=" + bingApiKey;

    mapEl.setAttribute("src", apiUrl);
}

// function to close the modal
var closePopUpWindow = function () {
    alertMessageEl.textContent = ""
    popUpEl.style.display = "none"
}

// Click search button
usrFormEl.addEventListener("submit", function () {
    mapArray = [];
    displayStationEl.innerHTML = "";
    zipOrpostal();
    inputEl.value = "";
});

//showing last search

var localStation = localStorage.getItem('lastCity');
var parsedStation = JSON.parse(localStation);
// console.log(parsedStation);

if (parsedStation) {
    inputEl.value = parsedStation;
    zipOrpostal();
}

// close the modal window
closePopUpBtn.addEventListener("click", closePopUpWindow);
