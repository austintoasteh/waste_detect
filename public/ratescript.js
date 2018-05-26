function init(){
    map = new google.maps.Map(document.getElementById('ratemap'), {
        center: {lat: 37.775, lng: -122.434},
        zoom: 15
    });

    document.getElementById("rate-btn").addEventListener("click", getLocation);

   // document.getElementById("subm").addEventListener("click", pushData);

    google.maps.event.addListener(map, "bounds_changed", function() {
       // send the new bounds back to your server
       var bounds = map.getBounds().toJSON();
       requestsRating(bounds["east"], bounds["west"], bounds["south"], bounds["north"],10);
       console.log("call heatmap request");
    });

    requestsRating(-79.313432,-79.437372 ,43.752594,43.634184, 0);
}

function initRateMap(lng, lat, rat) {
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(lng, lat, rat),
        map: map
    })

    //google.maps.event.addListener(map, "", function() {
   // send the new bounds back to your server
   //setBound(map.getBounds(),10);
//});
}









function requestsRating(longlo, longhi, latlo, lathi, slide){
    console.log("made request")
    var data = {"longlo":longlo, "longhi": longhi, "latlo": latlo, "lathi": lathi,"slide":slide}
    var path = 'map/';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", path);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  //Send the proper header info

    xhr.onreadystatechange = function() {//Call a function when the state changes (i.e. response comes back)
        // Update the dropdown when response is ready
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            var nodeList = JSON.parse(this.responseText);
            initRateMap(nodeList['long'], nodeList['lat'], nodeList['wt'])
        }
        else{
            console.log("Server Response: Error"); //RME
        }
    };

    var jsonString= JSON.stringify(data);     //generate JSON string
    xhr.send(jsonString);                       //send request to server
    // document.getElementById("console").innerHTML += "Sent request to " + path + ": "  + jsonString + "<br>"; //RME


}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function getLocation() {
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location: ' + pos.lat + "," + pos.lng);
            infoWindow.open(map);
            map.setCenter(pos);

            addRating(pos)

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    //TODO: DO the thing where you close the marker on the screen if more than one click.
}

function addRating(pos) {
    alert(pos.lat + "," + pos.lng);


    var text = '{ ' +
        '"employees" : [' +
        '{ "firstName":"John" , "lastName":"Doe" },' +
        '{ "firstName":"Anna" , "lastName":"Smith" },' +
        '{ "firstName":"Peter" , "lastName":"Jones" } ]}';

    var obj = JSON.parse(text);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(this.map);
}

init()

function getPoints(lng, lat, rat) {

    var result = [];
    for (var i = 0 ; i < lat.length ; i++) {
        result.push(
            {location: new google.maps.LatLng(latitude[i], longitude[i]), weight:rat[i]}
            );
    }
}