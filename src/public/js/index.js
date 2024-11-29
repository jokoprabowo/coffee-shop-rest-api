var map = L.map('map').setView([-3.513, 121.733], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
//     .openPopup();

var theMarker = {};

  map.on('click',function(e){
    lat = e.latlng.lat;
    lon = e.latlng.lng;

    if (theMarker != undefined) {
            map.removeLayer(theMarker);
    };

    document.getElementById("longitude").value = lon.toString();
    document.getElementById("latitude").value = lat.toString();
    
    //Add a marker to show where you clicked.
    theMarker = L.marker([lat,lon]).addTo(map);
});
