// select elements

var inputEl = document.querySelector(".text-input");
var searchButtonEl = document.querySelector("#search-station");
var displayStationEl = document.querySelector(".location-list");
var popUpEl = document.querySelector("#pop-up");
var alertMessageEl = document.querySelector("#alert-message");
var closePopUpBtn = document.querySelector("#close-btn");

//An array of lat and long coordinates to be used by the map api
var mapArray = [];


// Get zipcode or postal code
var zipOrpostal = function () {

    var location = inputEl.value;

    //saving last city in local storage
    localStorage.setItem('lastCity', JSON.stringify(location));
     
  

    //fetch data with location info
    fetch("https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?fuel_type=all&location=" + location + "&limit=5&radius=500&api_key=SwEWgqT1Snyw7Pp3sxyGmCNlQ5okceAAFKUr5PTU")
        .then(function (response) {

            if (response.ok) {

                response.json().then(function (data) {
                  //  console.log(data);

                    //populate the mapArray with locations
                    for (var i = 0; i < 5; i++) {

                        // get location data
                        var mapCoordinates = {
                            lat: data['fuel_stations'][i]['latitude'],
                            lon: data['fuel_stations'][i]['latitude'],
                        };
                        //create an array of coordinates for the map
                        mapArray.push(mapCoordinates);

                        //grab station details

                        var station = {
                            ev_network: data['fuel_stations'][i]['ev_network'],
                            ev_connector_types: data['fuel_stations'][i]['ev_connector_types'],
                            distance: data['fuel_stations'][i]['distance_km'],
                            address: data['fuel_stations'][i]['station_name'],
                            zip: data['fuel_stations'][i]['zip'],
                            phone: data['fuel_stations'][i]['station_phone'],
                            access: data['fuel_stations'][i]['access_code'],
                            accessHours: data['fuel_stations'][i]['access_days_time']
                        }

                      //  console.log(station.ev_network, station.ev_connector_types, station.distance,
                      //      station.address, station.zip, station.phone, station.access, station.accessHours);

                        //create elements and add content
                        var stationCard = document.createElement('div');
                        stationCard.classList.add("station-info");

                        var stationDetailNetwork = document.createElement('p');
                        stationDetailNetwork.innerHTML = `EV Network: ${station.ev_network}`;

                        var stationDetailConnectorType = document.createElement('p');
                        stationDetailConnectorType.innerHTML = `EV Connector Type: ${station.ev_connector_types}`;

                        var stationDetailDistance = document.createElement('p');
                        stationDetailDistance.innerHTML = `Station is ${station.distance}km away`;

                        var stationDetailAddress = document.createElement('p');
                        stationDetailAddress.innerHTML = `Station address: ${station.address}`;

                        var stationDetailZip = document.createElement('p');
                        stationDetailZip.innerHTML = `Zip: ${station.zip}`;

                        var stationDetailPhone = document.createElement('p');
                        stationDetailPhone.innerHTML = `Phone: ${station.phone}`;

                        var stationDetailAccess = document.createElement('p');
                        stationDetailAccess.innerHTML = `Access: ${station.access}`;

                        var stationDetailAccessHours = document.createElement('p');
                        stationDetailAccessHours.innerHTML = `Access Hours: ${station.access}`;

                        //add details to card
                        stationCard.appendChild(stationDetailNetwork);
                        stationCard.appendChild(stationDetailConnectorType);
                        stationCard.appendChild(stationDetailDistance);
                        stationCard.appendChild(stationDetailAddress);
                        stationCard.appendChild(stationDetailZip);
                        stationCard.appendChild(stationDetailPhone);
                        stationCard.appendChild(stationDetailAccess);
                        stationCard.appendChild(stationDetailAccessHours);


                        //add card to station details div
                        displayStationEl.appendChild(stationCard);
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
};

// function to close the modal
var closePopUpWindow = function () {
    alertMessageEl.textContent = ""
    popUpEl.style.display = "none"
}

// Click search button
searchButtonEl.addEventListener("click", function () {
    mapArray = [];
    displayStationEl.innerHTML = "";
    zipOrpostal();
    inputEl.value = "";
});

//showing last search

    var localStation = localStorage.getItem('lastCity');
    var parsedStation = JSON.parse(localStation);
    console.log(parsedStation);
 
    if(parsedStation){
        inputEl.value = parsedStation;
        zipOrpostal();
    }

closePopUpBtn.addEventListener("click", closePopUpWindow);
