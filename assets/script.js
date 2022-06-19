var inputEl = document.querySelector(".text-input");
var searchButtonEl = document.querySelector("#search-station");
 

// Get zipcode or postal code
var zipOrpostal = function(){

    fetch("https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?fuel_type=all&location=New+York&limit=10&radius=500&api_key=SwEWgqT1Snyw7Pp3sxyGmCNlQ5okceAAFKUr5PTU")
    .then(function(response){
        response.json().then(function(data){
            console.log(data);
            
            // get api data
            var station = {
                lon: data['longitude'],
                lat: data['latitude'],
                access: data['fuel_stations'][0]['access_code'],
                accessHours: data['fuel_stations'][0]['access_days_time'],
                distance: data['fuel_stations'][0]['distance_km'],
                ev_connector_types: data['fuel_stations'][0]['ev_connector_types'],
                ev_network: data['fuel_stations'][0]['ev_network'],
                address: data['fuel_stations'][0]['station_name'],
                phone: data['fuel_stations'][0]['station_phone'],
                zip: data['fuel_stations'][0]['zip'], 
            }

            //check data
            console.log(station.lon, station.lat, station.access, station.accessHours,
                station.distance, station.ev_connector_types, station.ev_network, station.address,
                station.phone, station.zip);
          

            //create elements
            var stationCard = document.createElement("div");
            var stationDetail = document.createElement("p");
         
        })
    })
}

searchButtonEl.addEventListener("click", function(){
    zipOrpostal();
    fillMap();
    searchButtonEl.innerHTML = "";
});