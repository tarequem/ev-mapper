// select elements

var inputEl = document.querySelector(".text-input");
var searchButtonEl = document.querySelector("#search-station");
var displayStationEl = document.querySelector("#station_details");

//An array of lat and long coordinates to be used by the map api
var mapArray = [];
 

// Get zipcode or postal code
var zipOrpostal = function(){

    var location = inputEl.value;
    console.log(location);

    //fetch data with location info
    fetch("https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?fuel_type=all&location="+location+"&limit=5&radius=500&api_key=SwEWgqT1Snyw7Pp3sxyGmCNlQ5okceAAFKUr5PTU")
    .then(function(response){

        if (response.ok){

            response.json().then(function(data){
            console.log(data);

            //populate the mapArray with locations
            for (var i=0; i <5; i++){
                
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

               console.log(station.ev_network, station.ev_connector_types, station.distance,
                station.address, station.zip, station.phone, station.access, station.accessHours);

                //create elements and add content
                var stationCard = document.createElement('div')
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
            alert('replace error message with modal');
        }






                 }) // end function response

 
};

// Click search button
searchButtonEl.addEventListener("click", function(){
    mapArray = [];
    zipOrpostal();
    inputEl.value = "";
 
    
});
 
 