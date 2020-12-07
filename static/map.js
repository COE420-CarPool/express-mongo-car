function finder(){
    var map = L.map('map');  
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {maxZoom: 20,}).addTo(map);  

map.locate({setView: [25.309322134955483,55.489917755094226], maxZoom: 15,  watch:true});

var startmarker;
var greenIcon = new L.Icon({
    iconUrl: 'https://www.flaticon.com/svg/static/icons/svg/744/744465.svg',
    iconSize: [60, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  
  });

 
function onLocationFound(e) {
    
        drivAtAus=[25.311826392441997, 55.49014091475329]; 
        startAtAus=[25.309322134955483,55.489917755094226];
        startmarker = L.marker(startAtAus).addTo(map).bindPopup("You are here!").openPopup();
       
        latitude1=startAtAus[0];
        console.log(latitude1);
        longitude1=startAtAus[1];
        latitude2=drivAtAus[0];
        console.log(latitude2);
        longitude2=drivAtAus[1];
        distance= ((Math.sqrt(Math.pow((latitude1-latitude2),2)+Math.pow((longitude1-longitude2),2)))*1000).toFixed(2);

        m = L.marker(drivAtAus, {icon: greenIcon}).bindPopup('<br><strong> Going to: Dubai Mall, Dubai <br> Departing: 7:15 PM <br>Gender: Male <br> Seats: 3 <br> Pickup Point: ESB <br> Plate Number: A654DE </strong> <br>  <i>You are within ' + distance + ' meters from this driver </i> <br><br> <button id="trigger">CLICK TO MATCH</button>').addTo(map).openPopup();
       
        $('#map').on('click', '#trigger', function() {
                $('#buttony').removeClass('bx-flashing');
                document.getElementById('buttony').innerHTML="Driver Chosen";
                $("#map").attr('style',  'visibility: hidden');
                //alert("Your information was sent to the driver! \n Please be at the pickup point within the specified departure time.")
                document.getElementById("mappity").innerHTML = "Your information was sent to the driver! <br> <strong> Please be at the pickup point within the specified departure time.</strong><br> Click to  <a href='ViewProfileDriver.html'> view your driver's profile</a>and message them there.";
        });




        /*
        map.on('click', function(ev) {
            console.log(ev.latlng); });
            var endlat = ev.latlng.lat;
            var endlong = ev.latlng.lng;
            endmarker = L.marker([endlat, endlong]).addTo(map)
            .bindPopup(L.popup({
                autoClose: false,
                closeOnClick: false,
            }))
            .setPopupContent('You are going to' + ev.latlng.toString())
            .openPopup();
            L.Routing.control({
                waypoints: [
                    L.latLng(e.latlng.lat, e.latlng.lng), 
                    L.latLng(endlat, endlong)
                ]  
            }).addTo(map);

    
 })
 */
}

map.on('locationfound', onLocationFound); //turn on map and detect location by default
}