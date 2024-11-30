var map = L.map('map').setView([-3.513, 121.733], 5);

let openStreet = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});

let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});

let mapList = [ openStreet, googleStreets, googleSat ];

mapList.map(item => {
  item.addTo(map);
});

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